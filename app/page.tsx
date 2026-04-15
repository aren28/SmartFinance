"use client";

import { useState, useEffect } from "react";
import AdviceBanner from "@/components/AdviceBanner";
import ExpenseInput from "@/components/ExpenseInput";
import ExpenseList from "@/components/ExpenseList";
import CategorySettings from "@/components/CategorySettings";
import { Expense } from "@/types";

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"expenses" | "categories">(
    "expenses"
  );

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const now = new Date();
        const res = await fetch(
          `/api/expenses?year=${now.getFullYear()}&month=${now.getMonth() + 1}`
        );
        if (res.ok) {
          const data = (await res.json()) as Expense[];
          setExpenses(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleExpenseAdded = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">AI 家計簿</h1>
          <p className="text-sm text-gray-500">
            自然言語で支出を記録、AIがアドバイス
          </p>
        </header>

        <AdviceBanner />

        <div className="flex gap-1 rounded-lg bg-gray-200 p-1">
          <button
            onClick={() => setActiveTab("expenses")}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              activeTab === "expenses"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            支出
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              activeTab === "categories"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            カテゴリ
          </button>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm space-y-4">
          {activeTab === "expenses" ? (
            <>
              <ExpenseInput onExpenseAdded={handleExpenseAdded} />
              {loading ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  読み込み中…
                </p>
              ) : (
                <ExpenseList expenses={expenses} />
              )}
            </>
          ) : (
            <CategorySettings />
          )}
        </div>
      </div>
    </main>
  );
}
