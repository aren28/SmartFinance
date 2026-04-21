// Prisma をモック
const mockFindMany = jest.fn();
jest.mock("@/lib/db", () => ({
  prisma: {
    expense: {
      findMany: mockFindMany,
    },
  },
}));

import { generateAdvice } from "@/lib/ai";
import { GET } from "@/app/api/advice/route";
import { Expense } from "@/types";
import { NextRequest } from "next/server";

beforeEach(() => {
  jest.clearAllMocks();
});

function makeExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: 1,
    amount: 1000,
    description: "テスト支出",
    rawText: "テスト 1000円",
    date: "2026-04-01",
    categoryId: 1,
    category: { id: 1, name: "食費", color: "#ff0000", icon: "🍔", createdAt: "", updatedAt: "" },
    createdAt: "",
    updatedAt: "",
    ...overrides,
  };
}

// ---------- generateAdvice() ----------

describe("generateAdvice()", () => {
  it("支出データありの場合に合計金額を含む string を返すこと", async () => {
    const expenses = [makeExpense({ amount: 3000 }), makeExpense({ amount: 2000 })];
    const result = await generateAdvice(expenses, "2026-04");
    expect(typeof result).toBe("string");
    expect(result).toContain("5000");
  });

  it("支出データなしの場合に「今月はまだ支出の記録がありません」を返すこと", async () => {
    const result = await generateAdvice([], "2026-04");
    expect(result).toContain("今月はまだ支出の記録がありません");
  });
});

// ---------- GET /api/advice ----------

describe("GET /api/advice", () => {
  function makeRequest(month?: string) {
    const url = month
      ? `http://localhost/api/advice?month=${month}`
      : "http://localhost/api/advice";
    return new NextRequest(url);
  }

  it("{ advice, generatedAt, month } を返すこと", async () => {
    mockFindMany.mockResolvedValue([
      {
        id: 1,
        amount: 1500,
        description: "ランチ",
        rawText: "ランチ 1500円",
        date: new Date("2026-04-10"),
        categoryId: 1,
        category: { id: 1, name: "食費", color: "#ff0000", icon: "🍔", createdAt: new Date(), updatedAt: new Date() },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const response = await GET(makeRequest("2026-04"));
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.advice).toBeDefined();
    expect(typeof json.advice).toBe("string");
    expect(json.generatedAt).toBeDefined();
    expect(json.month).toBe("2026-04");
  });

  it("支出なしの場合も { advice, generatedAt, month } を返すこと", async () => {
    mockFindMany.mockResolvedValue([]);

    const response = await GET(makeRequest("2026-04"));
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.advice).toContain("今月はまだ支出の記録がありません");
    expect(json.generatedAt).toBeDefined();
    expect(json.month).toBe("2026-04");
  });

  it("monthフォーマット不正の場合に400が返ること", async () => {
    const response = await GET(makeRequest("2026/04"));
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBeDefined();
  });
});
