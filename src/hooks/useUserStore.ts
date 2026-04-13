import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Store = Tables<"stores">;

export function useUserStore() {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setLoading(false); return; }

      const { data } = await supabase
        .from("stores")
        .select("*")
        .eq("owner_id", session.user.id)
        .limit(1)
        .maybeSingle();

      setStore(data);
      setLoading(false);
    };
    load();
  }, []);

  return { store, storeId: store?.id ?? null, loading };
}
