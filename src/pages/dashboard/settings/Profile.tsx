import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SettingsSubPage } from "./SettingsSubPage";

const Profile = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ full_name: "", phone: "", avatar_url: "", email: "" });
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return setLoading(false);
      const { data } = await supabase.from("profiles").select("*").eq("user_id", session.user.id).maybeSingle();
      setForm({ full_name: data?.full_name || "", phone: data?.phone || "", avatar_url: data?.avatar_url || "", email: session.user.email || "" });
      setLoading(false);
    })();
  }, []);

  const saveProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const { error } = await supabase.from("profiles").update({ full_name: form.full_name, phone: form.phone, avatar_url: form.avatar_url }).eq("user_id", session.user.id);
    toast({ title: error ? "Erreur" : "Profil mis à jour", description: error?.message, variant: error ? "destructive" : "default" });
  };

  const updatePassword = async () => {
    if (pwd.length < 6) return toast({ title: "Mot de passe trop court", variant: "destructive" });
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (!error) setPwd("");
    toast({ title: error ? "Erreur" : "Mot de passe modifié", description: error?.message, variant: error ? "destructive" : "default" });
  };

  return (
    <SettingsSubPage title="Mon Profil" description="Informations personnelles et sécurité du compte.">
      <Card><CardContent className="p-6 space-y-4">
        <div><Label>Email</Label><Input value={form.email} disabled /></div>
        <div><Label>Nom complet</Label><Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} /></div>
        <div><Label>Téléphone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
        <div><Label>URL Avatar</Label><Input value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} /></div>
        <Button onClick={saveProfile} disabled={loading}>Enregistrer le profil</Button>
      </CardContent></Card>
      <Card><CardContent className="p-6 space-y-4">
        <h3 className="font-semibold">Changer le mot de passe</h3>
        <div><Label>Nouveau mot de passe</Label><Input type="password" value={pwd} onChange={e => setPwd(e.target.value)} /></div>
        <Button onClick={updatePassword} variant="outline">Mettre à jour</Button>
      </CardContent></Card>
    </SettingsSubPage>
  );
};
export default Profile;