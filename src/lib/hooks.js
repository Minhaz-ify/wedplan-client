"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

export function useApi(path, { auth = true, enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!enabled || !path) return;
    setLoading(true);
    setError(null);
    try {
      setData(await api(path, { auth }));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [path, auth, enabled]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load, setData };
}
