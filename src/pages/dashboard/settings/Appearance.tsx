import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SettingsSubPage } from "./SettingsSubPage";
import { useUserStore } from "@/hooks/useUserStore";
import { supabase } from "@/integrations/supabase/client";
import { STORE_THEMES, StoreThemeId } from "@/themes/themes";
import { Check, Lock, Sparkles } from "lucide-react";

const Appearance = () => {
  const { toast } = useToast();
  const { store, storeId } = useUserStore();
  const [current, setCurrent] = useState<StoreThemeId>("default");
  const [planName, setPlanName] = useState<string>("Gratuit");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (store) setCurrent(((store as any).theme as StoreThemeId) || "default");
  }, [store]);

  useEffect(() => {
    if (!storeId) return;
    (async () => {
      const { data } = await supabase
        .from("store_subscriptions")
        .select("status, subscription_plans(name)")
        .eq("store_id", storeId)
        .eq("status", "active")
        .maybeSingle();
      const name = (data as any)?.subscription_plans?.name;
      if (name) setPlanName(name);
    })();
  }, [storeId]);

  const isPremium = /premium/i.test(planName);

  const apply = async (id: StoreThemeId) => {
    const theme = STORE_THEMES.find((t) => t.id === id)!;
    if (theme.tier === "premium" && !isPremium) {
      toast({
        title: "Thème Premium",
        description: "Passez au forfait Premium pour débloquer ce thème.",
        variant: "destructive",
      });
      return;
    }
    if (!storeId) return;
    setSaving(true);
    const { error } = await supabase.from("stores").update({ theme: id } as any).eq("id", storeId);
    setSaving(false);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    setCurrent(id);
    toast({ title: "Thème appliqué", description: `« ${theme.name} » est maintenant actif sur votre boutique.` });
  };

  return (
    <SettingsSubPage
      title="Apparence & Thème"
      description="Choisissez l'allure visuelle de votre boutique. Les thèmes premium sont inclus dans le forfait Premium."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {STORE_THEMES.map((t) => {
          const active = current === t.id;
          const locked = t.tier === "premium" && !isPremium;
          return (
            <Card key={t.id} className={`relative overflow-hidden transition ${active ? "ring-2 ring-primary" : ""}`}>
              <div
                className="h-32 relative flex items-end p-4"
                style={{ background: t.preview.bg, color: t.preview.text }}
              >
                <div className="absolute top-3 right-3 flex gap-2">
                  {t.tier === "premium" && (
                    <span className="bg-yellow-400 text-yellow-950 text-[10px] font-bold uppercase px-2 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Premium
                    </span>
                  )}
                  {active && (
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase px-2 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Actif
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full border-2 border-white/30" style={{ background: t.preview.accent }} />
                  <span className="font-bold text-lg">{t.name}</span>
                </div>
                {locked && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <CardContent className="p-4 space-y-3">
                <p className="text-sm text-muted-foreground">{t.description}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    {t.tier === "free" ? "Inclus" : "Forfait Premium requis"}
                  </span>
                  {locked ? (
                    <Link to="/dashboard/settings/billing">
                      <Button size="sm" variant="outline">Passer Premium</Button>
                    </Link>
                  ) : (
                    <Button size="sm" disabled={active || saving} onClick={() => apply(t.id)}>
                      {active ? "Thème actif" : "Appliquer"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </SettingsSubPage>
  );
};

export default Appearance;