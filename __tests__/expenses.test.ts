/**
 * expenses テスト
 * - parseExpenseText() の単体テスト
 * - POST /api/expenses のバリデーションテスト
 */

// Anthropic SDK をモック（モジュール読み込み前に定義する必要がある）
const mockCreate = jest.fn();
jest.mock("@anthropic-ai/sdk", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      messages: {
        create: mockCreate,
      },
    })),
  };
});

// Prisma をモック
const mockFindMany = jest.fn();
const mockUpsert = jest.fn();
const mockFindUnique = jest.fn();
const mockExpenseCreate = jest.fn();
jest.mock("@/lib/db", () => ({
  prisma: {
    category: {
      findMany: mockFindMany,
      upsert: mockUpsert,
      findUnique: mockFindUnique,
    },
    expense: {
      create: mockExpenseCreate,
    },
  },
}));

import { parseExpenseText } from "@/lib/ai";
import { POST } from "@/app/api/expenses/route";
import { NextRequest } from "next/server";

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------- parseExpenseText() ----------

describe("parseExpenseText()", () => {
  it("「ランチ 800円」を解析してamountが800になること", async () => {
    mockCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            amount: 800,
            description: "ランチ",
            categoryName: "食費",
            date: "2026-04-18",
          }),
        },
      ],
    });

    const result = await parseExpenseText("ランチ 800円", ["食費", "交通費"]);
    expect(result.amount).toBe(800);
    expect(result.description).toBe("ランチ");
    expect(result.categoryName).toBe("食費");
  });

  it("「昨日コンビニ 450円」を解析してamountが450になること", async () => {
    mockCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            amount: 450,
            description: "コンビニ",
            categoryName: "日用品",
            date: "2026-04-17",
          }),
        },
      ],
    });

    const result = await parseExpenseText("昨日コンビニ 450円", [
      "食費",
      "日用品",
    ]);
    expect(result.amount).toBe(450);
    expect(result.description).toBe("コンビニ");
  });
});

// ---------- POST /api/expenses ----------

describe("POST /api/expenses", () => {
  function makeRequest(body: unknown) {
    return new NextRequest("http://localhost/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("rawTextが空文字の場合に400が返ること", async () => {
    const response = await POST(makeRequest({ rawText: "" }));
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBeDefined();
  });

  it("rawTextが存在しない場合に400が返ること", async () => {
    const response = await POST(makeRequest({}));
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBeDefined();
  });

  it("rawTextが空白のみの場合に400が返ること", async () => {
    const response = await POST(makeRequest({ rawText: "   " }));
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBeDefined();
  });
});
