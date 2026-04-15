"use client";

import { useEffect } from "react";
import { useAdvice } from "@/hooks/useAdvice";

export default function AdviceBanner() {
  const { advice, loading, error, fetchAdvice } = useAdvice();

  useEffect(() => {
    fetchAdvice();
  }, [fetchAdvice]);

  if (loading) {
    return (
      <div className="rounded-lg bg-indigo-50 p-4 animate-pulse">
        <div className="h-4 bg-indigo-200 rounded w-3/4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!advice) return null;

  return (
    <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-4 space-y-1">
      <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
        今月のアドバイス
      </p>
      <p className="text-sm text-indigo-900">{advice.advice}</p>
      <div className="flex gap-4 pt-1 text-xs text-indigo-600">
        <span>合計: {advice.totalAmount.toLocaleString()}円</span>
        <span>最多カテゴリ: {advice.topCategory}</span>
      </div>
    </div>
  );
}
