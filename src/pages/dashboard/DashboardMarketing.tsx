import { Tag, Percent } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { useUserStore } from "@/hooks/useUserStore";
import type { Tables } from "@/integrations/supabase/types";

type Coupon = Tables<"coupons">;

const DashboardMarketing = () => {
  const { toast } = useToast();
  const { storeId, loading: storeLoading } = useUserStore();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ code: "", discount_type: "percentage", discount_value: "", min_order_amount: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!storeId) { setLoading(false); return; }
    const { data } = await supabase.from("coupons").select("*").eq("store_id", storeId).order("created_at", { ascending: false });
    setCoupons(data || []);
    setLoading(false);
  };

  useEffect(() => { if (!storeLoading) load(); }, [storeId, storeLoading]);

  const handleSave = async () => {
    if (!form.code || !storeId) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("coupons").insert({
        store_id: storeId,
        code: form.code.toUpperCase(),
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value) || 0,
        min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : null,
      });
      if (error) throw error;
      toast({ title: "Coupon créé" });
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("coupons").delete().eq("id", id);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketing</h1>
          <p className="text-muted-foreground">Gérez vos promotions et coupons</p>
        </div>
        <Button onClick={() => { setForm({ code: "", discount_type: "percentage", discount_value: "", min_order_amount: "" }); setDialogOpen(true); }} disabled={!storeId}>
          <Plus className="w-4 h-4" /> Nouveau coupon
        </Button>
      </div>

      {loading || storeLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun coupon créé</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div key={c.id} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-foreground text-lg">{c.code}</span>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(c.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Percent className="w-4 h-4" />
                {c.discount_value}{c.discount_type === "percentage" ? "%" : " FCFA"} de réduction
              </div>
              {c.min_order_amount && (
                <p className="text-xs text-muted-foreground mt-1">Min. {c.min_order_amount} FCFA</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">{c.used_count} utilisation(s) • {c.is_active ? "Actif" : "Inactif"}</p>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nouveau coupon</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Code *</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="EX: PROMO20" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm" value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}>
                  <option value="percentage">Pourcentage</option>
                  <option value="fixed">Montant fixe</option>
                </select>
              </div>
              <div><Label>Valeur</Label><Input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} /></div>
            </div>
            <div><Label>Commande minimum (FCFA)</Label><Input type="number" value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "..." : "Créer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardMarketing;
