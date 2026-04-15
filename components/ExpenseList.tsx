"use client";

import { Expense } from "@/types";

type Props = {
  expenses: Expense[];
};

export default function ExpenseList({ expenses }: Props) {
  if (expenses.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400 py-8">
        支出がまだありません。上の入力欄から記録してみましょう！
      </p>
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
              <p className="text-xs text-gray-500">
                {expense.category.name} ·{" "}
                {new Date(expense.date).toLocaleDateString("ja-JP")}
              </p>
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {expense.amount.toLocaleString()}円
          </span>
        </li>
      ))}
    </ul>
  );
}
