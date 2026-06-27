import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SettingsSubPage } from "./SettingsSubPage";
import { useLocalSettings } from "./useLocalSettings";

const CreatorProfile = () => {
  const { toast } = useToast();
  const { value, setValue, save, ready } = useLocalSettings("creator", {
    display_name: "", title: "", bio: "", instagram: "", tiktok: "", youtube: "", website: "",
  });
  return (
    <SettingsSubPage title="Profil du Créateur" description="Mettez en valeur votre expertise et connectez-vous avec vos clients."
      actions={<Button disabled={!ready} onClick={() => { save(value); toast({ title: "Profil créateur enregistré" }); }}>Enregistrer</Button>}>
      <Card><CardContent className="p-6 grid gap-4 md:grid-cols-2">
        <div><Label>Nom d'affichage</Label><Input value={value.display_name} onChange={e => setValue({ ...value, display_name: e.target.value })} /></div>
        <div><Label>Titre / Spécialité</Label><Input value={value.title} onChange={e => setValue({ ...value, title: e.target.value })} /></div>
        <div className="md:col-span-2"><Label>Bio</Label><Textarea rows={4} value={value.bio} onChange={e => setValue({ ...value, bio: e.target.value })} /></div>
        <div><Label>Instagram</Label><Input value={value.instagram} onChange={e => setValue({ ...value, instagram: e.target.value })} /></div>
        <div><Label>TikTok</Label><Input value={value.tiktok} onChange={e => setValue({ ...value, tiktok: e.target.value })} /></div>
        <div><Label>YouTube</Label><Input value={value.youtube} onChange={e => setValue({ ...value, youtube: e.target.value })} /></div>
        <div><Label>Site web</Label><Input value={value.website} onChange={e => setValue({ ...value, website: e.target.value })} /></div>
      </CardContent></Card>
    </SettingsSubPage>
  );
};
export default CreatorProfile;