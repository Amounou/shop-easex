import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/hooks/useUserStore";
import { SettingsSubPage } from "./SettingsSubPage";
import { useLocalSettings } from "./useLocalSettings";

const Domain = () => {
  const { toast } = useToast();
  const { store } = useUserStore();
  const { value, setValue, save, ready } = useLocalSettings("domain", { custom_domain: "", verified: false });
  const defaultUrl = store ? `${window.location.origin}/store/${store.slug}` : "";
  return (
    <SettingsSubPage title="Nom de domaine" description="Connectez votre propre nom de domaine à votre boutique.">
      <Card><CardContent className="p-6 space-y-3">
        <Label>URL par défaut</Label>
        <div className="flex items-center gap-2">
          <Input value={defaultUrl} readOnly />
          <Button variant="outline" onClick={() => { navigator.clipboard.writeText(defaultUrl); toast({ title: "Copié" }); }}>Copier</Button>
        </div>
      </CardContent></Card>
      <Card><CardContent className="p-6 space-y-4">
        <div>
          <Label>Domaine personnalisé</Label>
          <Input placeholder="boutique.exemple.com" value={value.custom_domain} onChange={e => setValue({ ...value, custom_domain: e.target.value })} />
        </div>
        <p className="text-sm text-muted-foreground">Ajoutez un enregistrement CNAME pointant vers <code className="bg-muted px-1.5 py-0.5 rounded">cname.shopease.app</code>.</p>
        <div className="flex items-center gap-3">
          <Button disabled={!ready} onClick={() => { save(value); toast({ title: "Domaine enregistré" }); }}>Enregistrer</Button>
          {value.custom_domain && <Badge variant={value.verified ? "default" : "secondary"}>{value.verified ? "Vérifié" : "En attente"}</Badge>}
          {value.custom_domain && !value.verified && <Button variant="outline" onClick={() => { save({ ...value, verified: true }); toast({ title: "Domaine vérifié" }); }}>Vérifier</Button>}
        </div>
      </CardContent></Card>
    </SettingsSubPage>
  );
};
export default Domain;