import { useState, useCallback } from "react";
import { AdviceResponse } from "@/types";

type UseAdviceReturn = {
  advice: AdviceResponse | null;
  loading: boolean;
  error: string | null;
  fetchAdvice: (year?: number, month?: number) => Promise<void>;
};

export function useAdvice(): UseAdviceReturn {
  const [advice, setAdvice] = useState<AdviceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = useCallback(
    async (
      year = new Date().getFullYear(),
      month = new Date().getMonth() + 1
    ) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/advice?year=${year}&month=${month}`
        );
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "アドバイスの取得に失敗しました");
        }
        const data = (await res.json()) as AdviceResponse;
        setAdvice(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "予期しないエラー");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { advice, loading, error, fetchAdvice };
}
