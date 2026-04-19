"use client";

import { Expense } from "@/types";

type Props = {
  expenses: Expense[];
  onDelete: (id: number) => void;
};

export default function ExpenseList({ expenses, onDelete }: Props) {
  if (expenses.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400 py-8">支出がありません</p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {expenses.map((expense) => (
        <li key={expense.id} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">{expense.category.icon}</span>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {expense.description}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="inline-block text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: expense.category.color + "20",
                    color: expense.category.color,
                  }}
                >
                  {expense.category.name}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(expense.date).toLocaleDateString("ja-JP")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-900">
              {expense.amount.toLocaleString()}円
            </span>
            <button
              onClick={() => onDelete(expense.id)}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              aria-label="削除"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
