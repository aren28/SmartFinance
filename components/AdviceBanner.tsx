"use client";

import { useAdvice } from "@/hooks/useAdvice";

export default function AdviceBanner() {
  const { advice, loading, error, refresh } = useAdvice();

  if (loading) {
    return (
      <div
        className="rounded-[14px] p-4 animate-pulse"
        style={{ backgroundColor: "#E1F5EE", minHeight: "72px" }}
      >
        <div className="h-3 rounded w-16 mb-2" style={{ backgroundColor: "#9FE1CB" }} />
        <div className="h-4 rounded w-3/4" style={{ backgroundColor: "#9FE1CB" }} />
      </div>
    );
  }

  if (error || !advice) return null;

  return (
    <div className="rounded-[14px] p-4 space-y-1" style={{ backgroundColor: "#E1F5EE" }}>
      <span
        className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: "#9FE1CB" }}
      >
        AIアドバイス
      </span>
      <p className="text-sm" style={{ color: "#085041" }}>
        {advice}
      </p>
      <div className="flex justify-end pt-1">
        <button
          onClick={refresh}
          disabled={loading}
          className="text-xs px-2 py-1 rounded disabled:opacity-50"
          style={{ color: "#085041" }}
        >
          更新
        </button>
      </div>
    </div>
  );
}
