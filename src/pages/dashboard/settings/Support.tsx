import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SettingsSubPage } from "./SettingsSubPage";
import { useLocalSettings } from "./useLocalSettings";

const Support = () => {
  const { toast } = useToast();
  const { value, setValue, save, ready } = useLocalSettings("support", {
    contact_email: "", contact_phone: "", whatsapp: "", live_chat: false, support_hours: "Lun-Ven 9h-18h",
  });
  return (
    <SettingsSubPage title="Support client" description="Vos informations de contact et options de support."
      actions={<Button disabled={!ready} onClick={() => { save(value); toast({ title: "Support enregistré" }); }}>Enregistrer</Button>}>
      <Card><CardContent className="p-6 grid gap-4 md:grid-cols-2">
        <div><Label>Email support</Label><Input type="email" value={value.contact_email} onChange={e => setValue({ ...value, contact_email: e.target.value })} /></div>
        <div><Label>Téléphone</Label><Input value={value.contact_phone} onChange={e => setValue({ ...value, contact_phone: e.target.value })} /></div>
        <div><Label>WhatsApp</Label><Input value={value.whatsapp} onChange={e => setValue({ ...value, whatsapp: e.target.value })} /></div>
        <div><Label>Horaires</Label><Input value={value.support_hours} onChange={e => setValue({ ...value, support_hours: e.target.value })} /></div>
        <div className="md:col-span-2 flex items-center justify-between"><Label>Activer le chat en direct</Label>
          <Switch checked={value.live_chat} onCheckedChange={v => setValue({ ...value, live_chat: v })} /></div>
      </CardContent></Card>
    </SettingsSubPage>
  );
};
export default Support;