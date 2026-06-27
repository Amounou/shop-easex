import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SettingsSubPage } from "./SettingsSubPage";
import { useLocalSettings } from "./useLocalSettings";

const Tracking = () => {
  const { toast } = useToast();
  const { value, setValue, save, ready } = useLocalSettings("tracking", {
    facebook_pixel: "", gtm_id: "", ga_id: "", tiktok_pixel: "", custom_head: "", custom_body: "",
  });
  return (
    <SettingsSubPage title="Pixels et Tracking" description="Connectez vos outils d'analyse et de suivi."
      actions={<Button disabled={!ready} onClick={() => { save(value); toast({ title: "Tracking enregistré" }); }}>Enregistrer</Button>}>
      <Card><CardContent className="p-6 grid gap-4 md:grid-cols-2">
        <div><Label>Facebook Pixel ID</Label><Input value={value.facebook_pixel} onChange={e => setValue({ ...value, facebook_pixel: e.target.value })} /></div>
        <div><Label>Google Tag Manager</Label><Input value={value.gtm_id} onChange={e => setValue({ ...value, gtm_id: e.target.value })} placeholder="GTM-XXXX" /></div>
        <div><Label>Google Analytics</Label><Input value={value.ga_id} onChange={e => setValue({ ...value, ga_id: e.target.value })} placeholder="G-XXXX" /></div>
        <div><Label>TikTok Pixel</Label><Input value={value.tiktok_pixel} onChange={e => setValue({ ...value, tiktok_pixel: e.target.value })} /></div>
        <div className="md:col-span-2"><Label>Scripts personnalisés (head)</Label><Textarea rows={3} value={value.custom_head} onChange={e => setValue({ ...value, custom_head: e.target.value })} /></div>
        <div className="md:col-span-2"><Label>Scripts personnalisés (body)</Label><Textarea rows={3} value={value.custom_body} onChange={e => setValue({ ...value, custom_body: e.target.value })} /></div>
      </CardContent></Card>
    </SettingsSubPage>
  );
};
export default Tracking;