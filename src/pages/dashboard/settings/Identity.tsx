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
import { Upload, ImageIcon, Loader2 } from "lucide-react";

const Identity = () => {
  const { store, loading } = useUserStore();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", description: "", logo_url: "", email: "", phone: "", address: "", city: "", country: "", currency: "XOF" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !store) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Format invalide", description: "Sélectionnez une image (PNG, JPG, SVG...)", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Fichier trop volumineux", description: "Taille maximum : 5 Mo", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Non authentifié");
      const ext = file.name.split(".").pop() || "png";
      const path = `${session.user.id}/${store.id}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("store-logos").upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("store-logos").getPublicUrl(path);
      setForm((f) => ({ ...f, logo_url: data.publicUrl }));
      toast({ title: "Logo téléversé", description: "N'oubliez pas d'enregistrer." });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <SettingsSubPage title="Identité de la boutique" description="Nom, logo, description et coordonnées de votre boutique."
      actions={<Button onClick={save} disabled={saving || loading || !store}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>}>
      <Card><CardContent className="p-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2"><Label>Nom de la boutique</Label><Input value={form.name} onChange={set("name")} /></div>
        <div className="md:col-span-2"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={set("description")} /></div>
        <div className="md:col-span-2 space-y-2">
          <Label>Logo de la boutique</Label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {form.logo_url ? (
                <img src={form.logo_url} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <label className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border border-input bg-background hover:bg-accent text-sm font-medium cursor-pointer transition-colors">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? "Téléversement..." : "Choisir une image"}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading || !store} />
              </label>
              <Input value={form.logo_url} onChange={set("logo_url")} placeholder="ou collez une URL https://..." />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">PNG, JPG ou SVG • 5 Mo maximum</p>
        </div>
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