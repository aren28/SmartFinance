"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types";

export default function CategorySettings() {
  const [categories, setCategories] = useState<
    (Category & { _count: { expenses: number } })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
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
        body: JSON.stringify({ name: newName }),
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
      setError(
        `このカテゴリには${expenseCount}件の支出があるため削除できません`
      );
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
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
      <form onSubmit={handleCreate} className="flex gap-2">
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
      </form>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <ul className="divide-y divide-gray-100">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex items-center justify-between py-2 text-sm"
          >
            <span>
              {cat.icon} {cat.name}{" "}
              <span className="text-gray-400">({cat._count.expenses}件)</span>
            </span>
            <button
              onClick={() => handleDelete(cat.id, cat._count.expenses)}
              className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"
              disabled={cat._count.expenses > 0}
              title={
                cat._count.expenses > 0
                  ? "支出があるため削除不可"
                  : "削除"
              }
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
