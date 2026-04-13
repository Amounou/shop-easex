import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save } from "lucide-react";
import { useUserStore } from "@/hooks/useUserStore";

const DashboardSettings = () => {
  const { toast } = useToast();
  const { store, loading } = useUserStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", email: "", phone: "", address: "", city: "", country: "" });

  useEffect(() => {
    if (store) {
      setForm({
        name: store.name || "", description: store.description || "", email: store.email || "",
        phone: store.phone || "", address: store.address || "", city: store.city || "", country: store.country || "",
      });
    }
  }, [store]);

  const handleSave = async () => {
    if (!store) return;
    setSaving(true);
    const { error } = await supabase.from("stores").update(form).eq("id", store.id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else toast({ title: "Paramètres sauvegardés" });
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-1">Paramètres</h1>
      <p className="text-muted-foreground mb-6">Configurez votre boutique</p>

      {!store ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Créez d'abord une boutique pour accéder aux paramètres</p>
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-semibold text-foreground">Informations générales</h2>
            <div><Label>Nom de la boutique</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-semibold text-foreground">Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Téléphone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-semibold text-foreground">Adresse</h2>
            <div><Label>Adresse</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Ville</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
              <div><Label>Pays</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save className="w-4 h-4" /> {saving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardSettings;
