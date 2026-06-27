import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SettingsSubPage } from "./SettingsSubPage";
import { useLocalSettings } from "./useLocalSettings";

const Seo = () => {
  const { toast } = useToast();
  const { value, setValue, save, ready } = useLocalSettings("seo", {
    title: "", description: "", keywords: "", og_image: "",
  });
  return (
    <SettingsSubPage title="SEO & Référencement" description="Optimisez le référencement de votre boutique."
      actions={<Button disabled={!ready} onClick={() => { save(value); toast({ title: "SEO enregistré" }); }}>Enregistrer</Button>}>
      <Card><CardContent className="p-6 space-y-4">
        <div><Label>Titre (max 60 car.)</Label><Input maxLength={60} value={value.title} onChange={e => setValue({ ...value, title: e.target.value })} /></div>
        <div><Label>Meta description (max 160 car.)</Label><Textarea maxLength={160} value={value.description} onChange={e => setValue({ ...value, description: e.target.value })} /></div>
        <div><Label>Mots-clés</Label><Input value={value.keywords} onChange={e => setValue({ ...value, keywords: e.target.value })} placeholder="mode, accessoires, ..." /></div>
        <div><Label>Image OG (URL)</Label><Input value={value.og_image} onChange={e => setValue({ ...value, og_image: e.target.value })} /></div>
      </CardContent></Card>
    </SettingsSubPage>
  );
};
export default Seo;