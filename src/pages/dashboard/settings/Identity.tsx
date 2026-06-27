import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserStore } from "@/hooks/useUserStore";
import { SettingsSubPage } from "./SettingsSubPage";

const Identity = () => {
  const { store, loading } = useUserStore();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", description: "", logo_url: "", email: "", phone: "", address: "", city: "", country: "", currency: "XOF" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (store) setForm({
      name: store.name || "", description: store.description || "", logo_url: store.logo_url || "",
      email: store.email || "", phone: store.phone || "", address: store.address || "",
      city: store.city || "", country: store.country || "", currency: store.currency || "XOF",
    });
  }, [store]);

  const save = async () => {
    if (!store) return;
    setSaving(true);
    const { error } = await supabase.from("stores").update(form).eq("id", store.id);
    setSaving(false);
    toast({ title: error ? "Erreur" : "Identité mise à jour", description: error?.message, variant: error ? "destructive" : "default" });
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <SettingsSubPage title="Identité de la boutique" description="Nom, logo, description et coordonnées de votre boutique."
      actions={<Button onClick={save} disabled={saving || loading || !store}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>}>
      <Card><CardContent className="p-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2"><Label>Nom de la boutique</Label><Input value={form.name} onChange={set("name")} /></div>
        <div className="md:col-span-2"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={set("description")} /></div>
        <div className="md:col-span-2"><Label>URL du logo</Label><Input value={form.logo_url} onChange={set("logo_url")} placeholder="https://..." /></div>
        <div><Label>Email</Label><Input type="email" value={form.email} onChange={set("email")} /></div>
        <div><Label>Téléphone</Label><Input value={form.phone} onChange={set("phone")} /></div>
        <div className="md:col-span-2"><Label>Adresse</Label><Input value={form.address} onChange={set("address")} /></div>
        <div><Label>Ville</Label><Input value={form.city} onChange={set("city")} /></div>
        <div><Label>Pays</Label><Input value={form.country} onChange={set("country")} /></div>
        <div><Label>Devise</Label><Input value={form.currency} onChange={set("currency")} /></div>
      </CardContent></Card>
    </SettingsSubPage>
  );
};
export default Identity;