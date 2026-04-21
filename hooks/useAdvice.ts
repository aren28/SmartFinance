import { useState, useEffect, useCallback } from "react";

type UseAdviceReturn = {
  advice: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useAdvice(month?: string): UseAdviceReturn {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = month ? `?month=${month}` : "";
      const res = await fetch(`/api/advice${query}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "アドバイスの取得に失敗しました");
      }
      const data = await res.json();
      setAdvice(data.advice as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "予期しないエラー");
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchAdvice();
  }, [fetchAdvice]);

  return { advice, loading, error, refresh: fetchAdvice };
}
