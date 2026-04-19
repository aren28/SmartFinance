"use client";

import { useEffect } from "react";
import { useAdvice } from "@/hooks/useAdvice";

export default function AdviceBanner() {
  const { advice, loading, fetchAdvice } = useAdvice();

  useEffect(() => {
    fetchAdvice();
  }, [fetchAdvice]);

  if (loading) {
    return (
      <div className="rounded-lg p-4 animate-pulse" style={{ backgroundColor: "#E1F5EE" }}>
        <div className="h-3 rounded w-16 mb-2" style={{ backgroundColor: "#A7DFC8" }} />
        <div className="h-4 rounded w-3/4" style={{ backgroundColor: "#A7DFC8" }} />
      </div>
    );
  }

  if (!advice) return null;

  return (
    <div className="rounded-lg p-4 space-y-1" style={{ backgroundColor: "#E1F5EE" }}>
      <span
        className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: "#34C48B", color: "#fff" }}
      >
        AIアドバイス
      </span>
      <p className="text-sm text-gray-800">{advice.advice}</p>
      <div className="flex gap-4 pt-1 text-xs text-gray-500">
        <span>合計: {advice.totalAmount.toLocaleString()}円</span>
        <span>最多カテゴリ: {advice.topCategory}</span>
      </div>
    </div>
  );
}
