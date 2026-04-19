"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types";

type CategoryWithCount = Category & { _count: { expenses: number } };

const PRESET_COLORS = [
  "#6366f1", "#059669", "#7C3AED", "#D97706",
  "#DC2626", "#0284C7", "#BE185D", "#65A30D",
];

export default function CategorySettings() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("カテゴリの取得に失敗しました");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "予期しないエラー");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, color: newColor }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "作成に失敗しました");
      }
      setNewName("");
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "予期しないエラー");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number, expenseCount: number) => {
    if (expenseCount > 0) {
      setError(`このカテゴリには${expenseCount}件の支出があるため削除できません`);
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const data = await res.json();
        throw new Error(data.error ?? "削除に失敗しました");
      }
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "予期しないエラー");
    }
  };

  if (loading) return <p className="text-sm text-gray-400">読み込み中…</p>;

  return (
    <div className="space-y-4">
      <form onSubmit={handleCreate} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="新しいカテゴリ名"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            disabled={creating}
          />
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            追加
          </button>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setNewColor(color)}
              className="w-6 h-6 rounded-full border-2 transition-transform"
              style={{
                backgroundColor: color,
                borderColor: newColor === color ? "#1e293b" : "transparent",
                transform: newColor === color ? "scale(1.2)" : "scale(1)",
              }}
              aria-label={color}
            />
          ))}
        </div>
      </form>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <ul className="divide-y divide-gray-100">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex items-center justify-between py-2 text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full inline-block flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span>
                {cat.icon} {cat.name}{" "}
                <span className="text-gray-400">({cat._count.expenses}件)</span>
              </span>
            </div>
            <button
              onClick={() => handleDelete(cat.id, cat._count.expenses)}
              className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"
              disabled={cat._count.expenses > 0}
              title={cat._count.expenses > 0 ? "支出があるため削除不可" : "削除"}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
