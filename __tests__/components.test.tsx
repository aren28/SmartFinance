/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdviceBanner from "@/components/AdviceBanner";
import ExpenseInput from "@/components/ExpenseInput";
import ExpenseList from "@/components/ExpenseList";

jest.mock("@/hooks/useAdvice", () => ({
  useAdvice: () => ({
    advice: null,
    loading: true,
    error: null,
    fetchAdvice: jest.fn(),
  }),
}));

const sampleCategory = {
  id: 1,
  name: "食費",
  color: "#4F46E5",
  icon: "🍜",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

const sampleExpenses = [
  {
    id: 1,
    amount: 850,
    description: "スターバックス",
    rawText: "スタバで850円",
    date: "2024-04-15T10:00:00Z",
    categoryId: 1,
    category: sampleCategory,
    createdAt: "2024-04-15T10:00:00Z",
    updatedAt: "2024-04-15T10:00:00Z",
  },
];

describe("AdviceBanner", () => {
  it("レンダリングされること", () => {
    const { container } = render(<AdviceBanner />);
    expect(container.firstChild).not.toBeNull();
  });
});

describe("ExpenseInput", () => {
  it("送信したときにonSubmitが呼ばれること", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<ExpenseInput categories={[sampleCategory]} onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText(/スタバで500円/);
    fireEvent.change(input, { target: { value: "ランチ1000円" } });

    fireEvent.click(screen.getByRole("button", { name: "記録" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("ランチ1000円", sampleCategory.id);
    });
  });
});

describe("ExpenseList", () => {
  it("空のとき「支出がありません」が表示されること", () => {
    render(<ExpenseList expenses={[]} onDelete={jest.fn()} />);
    expect(screen.getByText("支出がありません")).toBeInTheDocument();
  });

  it("支出一覧が表示されること", () => {
    render(<ExpenseList expenses={sampleExpenses} onDelete={jest.fn()} />);
    expect(screen.getByText("スターバックス")).toBeInTheDocument();
  });
});
