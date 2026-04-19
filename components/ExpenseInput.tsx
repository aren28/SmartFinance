"use client";

import { useState } from "react";
import { Category } from "@/types";

type Props = {
  categories: Category[];
  onSubmit: (rawText: string, categoryId: number) => Promise<void>;
};

export default function ExpenseInput({ categories, onSubmit }: Props) {
  const [text, setText] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    categories[0]?.id ?? null
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || selectedCategoryId === null) return;

    setSubmitting(true);
    try {
      await onSubmit(text.trim(), selectedCategoryId);
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategoryId(cat.id)}
            className="flex-shrink-0 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border transition-colors"
            style={
              selectedCategoryId === cat.id
                ? { backgroundColor: cat.color, color: "#fff", borderColor: cat.color }
                : { backgroundColor: "#f3f4f6", color: "#374151", borderColor: "#e5e7eb" }
            }
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="例: スタバで500円、電車代200円"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting || !text.trim() || selectedCategoryId === null}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "解析中…" : "記録"}
        </button>
      </div>
    </form>
  );
}
