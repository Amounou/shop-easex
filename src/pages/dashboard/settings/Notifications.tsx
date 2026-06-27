import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SettingsSubPage } from "./SettingsSubPage";
import { useLocalSettings } from "./useLocalSettings";

const Notifications = () => {
  const { toast } = useToast();
  const { value, setValue, save, ready } = useLocalSettings("notifications", {
    email_orders: true, email_customers: false, email_reviews: true,
    telegram_enabled: false, telegram_chat_id: "",
  });
  const Row = ({ label, k }: { label: string; k: keyof typeof value }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <Switch checked={Boolean(value[k])} onCheckedChange={(v) => setValue({ ...value, [k]: v })} />
    </div>
  );
  return (
    <SettingsSubPage title="Notifications" description="Gérez les alertes email et Telegram."
      actions={<Button disabled={!ready} onClick={() => { save(value); toast({ title: "Notifications enregistrées" }); }}>Enregistrer</Button>}>
      <Card><CardContent className="p-6 divide-y">
        <Row label="Nouvelles commandes par email" k="email_orders" />
        <Row label="Nouveaux clients par email" k="email_customers" />
        <Row label="Nouveaux avis par email" k="email_reviews" />
      </CardContent></Card>
      <Card><CardContent className="p-6 space-y-3">
        <Row label="Activer les notifications Telegram" k="telegram_enabled" />
        {value.telegram_enabled && (
          <div><Label>Chat ID Telegram</Label><Input value={value.telegram_chat_id} onChange={e => setValue({ ...value, telegram_chat_id: e.target.value })} /></div>
        )}
      </CardContent></Card>
    </SettingsSubPage>
  );
};
export default Notifications;