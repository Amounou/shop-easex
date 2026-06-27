import { useEffect, useState } from "react";
import { useUserStore } from "@/hooks/useUserStore";

export function useLocalSettings<T extends object>(key: string, defaults: T) {
  const { storeId } = useUserStore();
  const fullKey = storeId ? `settings:${storeId}:${key}` : null;
  const [value, setValue] = useState<T>(defaults);

  useEffect(() => {
    if (!fullKey) return;
    try {
      const raw = localStorage.getItem(fullKey);
      if (raw) setValue({ ...defaults, ...JSON.parse(raw) });
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullKey]);

  const save = (next: T) => {
    setValue(next);
    if (fullKey) localStorage.setItem(fullKey, JSON.stringify(next));
  };
  return { value, setValue, save, ready: !!fullKey };
}