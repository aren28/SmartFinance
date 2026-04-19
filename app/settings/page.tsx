"use client";

import Link from "next/link";
import CategorySettings from "@/components/CategorySettings";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <header className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← ホーム
          </Link>
          <h1 className="text-xl font-bold text-gray-900">カテゴリ設定</h1>
        </header>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <CategorySettings />
        </div>
      </div>
    </main>
  );
}
