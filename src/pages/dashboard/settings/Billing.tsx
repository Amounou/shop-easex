import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserStore } from "@/hooks/useUserStore";
import { useToast } from "@/hooks/use-toast";
import { SettingsSubPage } from "./SettingsSubPage";

const Billing = () => {
  const { store } = useUserStore();
  const { toast } = useToast();
  const [plans, setPlans] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);

  const load = async () => {
    const { data: p } = await supabase.from("subscription_plans").select("*").eq("is_active", true).order("sort_order");
    setPlans(p || []);
    if (store) {
      const { data: s } = await supabase.from("store_subscriptions").select("*, subscription_plans(*)").eq("store_id", store.id).maybeSingle();
      setCurrent(s);
    }
  };
  useEffect(() => { load(); }, [store]);

  const switchPlan = async (planId: string) => {
    if (!store) return;
    const { error } = current
      ? await supabase.from("store_subscriptions").update({ plan_id: planId, status: "active" }).eq("store_id", store.id)
      : await supabase.from("store_subscriptions").insert([{
          store_id: store.id, plan_id: planId, status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        }]);
    toast({ title: error ? "Erreur" : "Forfait mis à jour", description: error?.message, variant: error ? "destructive" : "default" });
    if (!error) load();
  };

  return (
    <SettingsSubPage title="Facturation" description="Gérez votre forfait et votre facturation.">
      {current?.subscription_plans && (
        <Card><CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
          <div><p className="text-sm text-muted-foreground">Forfait actuel</p><h3 className="text-xl font-bold">{current.subscription_plans.name}</h3></div>
          <Badge>{current.status}</Badge>
        </CardContent></Card>
      )}
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map(p => {
          const features = Array.isArray(p.features) ? p.features : [];
          const active = current?.plan_id === p.id;
          return (
            <Card key={p.id} className={active ? "border-primary" : ""}><CardContent className="p-6 space-y-3">
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className="text-2xl font-bold">{Number(p.price).toLocaleString()} {p.currency}<span className="text-sm font-normal text-muted-foreground">/{p.interval}</span></p>
              <ul className="space-y-1 text-sm">
                {features.map((f: string, i: number) => <li key={i} className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />{f}</li>)}
              </ul>
              <Button className="w-full" disabled={active} onClick={() => switchPlan(p.id)}>{active ? "Forfait actif" : "Choisir"}</Button>
            </CardContent></Card>
          );
        })}
      </div>
    </SettingsSubPage>
  );
};
export default Billing;