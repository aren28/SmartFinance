"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdviceBanner from "@/components/AdviceBanner";
import ExpenseInput from "@/components/ExpenseInput";
import ExpenseList from "@/components/ExpenseList";
import { Expense, Category } from "@/types";

function monthParam(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalThisMonth, setTotalThisMonth] = useState(0);
  const [totalLastMonth, setTotalLastMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const [expRes, catRes, lastRes] = await Promise.all([
        fetch(`/api/expenses?month=${monthParam(now)}`),
        fetch("/api/categories"),
        fetch(`/api/expenses?month=${monthParam(lastMonth)}`),
      ]);

      if (expRes.ok) {
        const data = await expRes.json();
        setExpenses(data.expenses ?? []);
        setTotalThisMonth(data.total ?? 0);
      }
      if (catRes.ok) {
        setCategories(await catRes.json());
      }
      if (lastRes.ok) {
        const data = await lastRes.json();
        setTotalLastMonth(data.total ?? 0);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSubmit = async (rawText: string, categoryId: number) => {
    setSubmitError(null);
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawText, categoryId: String(categoryId) }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "支出の登録に失敗しました");
    }

    const data = await res.json();
    const newExpense = data.expense as Expense;
    setExpenses((prev) => [newExpense, ...prev]);
    setTotalThisMonth((prev) => prev + newExpense.amount);
  };

  const handleDelete = async (id: number) => {
    const expense = expenses.find((e) => e.id === id);
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    if (res.ok && expense) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      setTotalThisMonth((prev) => prev - expense.amount);
    }
  };

  const diff =
    totalLastMonth > 0
      ? Math.round(((totalThisMonth - totalLastMonth) / totalLastMonth) * 100)
      : null;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI 家計簿</h1>
            <p className="text-sm text-gray-500">自然言語で支出を記録</p>
          </div>
          <Link
            href="/settings"
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            設定
          </Link>
        </header>

        <AdviceBanner />

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">今月の支出合計</p>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {loading ? "…" : totalThisMonth.toLocaleString()}円
            </span>
            {diff !== null && !loading && (
              <span
                className={`mb-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                  diff > 0
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {diff > 0 ? `+${diff}%` : `${diff}%`} 前月比
              </span>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          {submitError && (
            <p className="text-xs text-red-600 mb-3">{submitError}</p>
          )}
          <ExpenseInput categories={categories} onSubmit={handleSubmit} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">支出履歴</h2>
          <div className="rounded-xl bg-white shadow-sm divide-y divide-gray-100">
            {loading ? (
              <p className="text-sm text-gray-400 text-center py-8">読み込み中…</p>
            ) : (
              <ExpenseList expenses={expenses} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
