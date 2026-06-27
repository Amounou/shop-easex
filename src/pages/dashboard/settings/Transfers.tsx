import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SettingsSubPage } from "./SettingsSubPage";
import { useLocalSettings } from "./useLocalSettings";

type Req = { id: string; email: string; status: string; created_at: string };

const Transfers = () => {
  const { toast } = useToast();
  const { value, save, ready } = useLocalSettings<{ requests: Req[] }>("transfers", { requests: [] });
  const [email, setEmail] = useState("");

  const request = () => {
    if (!email) return;
    save({ requests: [...value.requests, { id: Date.now().toString(), email, status: "en attente", created_at: new Date().toISOString() }] });
    setEmail(""); toast({ title: "Demande de transfert créée" });
  };

  return (
    <SettingsSubPage title="Transferts de propriété" description="Transférez la propriété de votre boutique à un autre utilisateur.">
      <Card><CardContent className="p-6 space-y-4">
        <div><Label>Email du nouveau propriétaire</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <p className="text-sm text-muted-foreground">Le nouveau propriétaire recevra un email d'invitation pour accepter le transfert.</p>
        <Button disabled={!ready} onClick={request}>Demander le transfert</Button>
      </CardContent></Card>
      {value.requests.length > 0 && (
        <Card><CardContent className="p-6"><ul className="divide-y">{value.requests.map(r => (
          <li key={r.id} className="flex items-center justify-between py-3">
            <div><p className="font-medium">{r.email}</p><p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p></div>
            <Badge variant="secondary">{r.status}</Badge>
          </li>
        ))}</ul></CardContent></Card>
      )}
    </SettingsSubPage>
  );
};
export default Transfers;