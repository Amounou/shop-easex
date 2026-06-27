import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SettingsSubPage } from "./SettingsSubPage";
import { useLocalSettings } from "./useLocalSettings";

const themes = [
  { id: "emerald", name: "Émeraude", color: "#10b981" },
  { id: "indigo", name: "Indigo", color: "#6366f1" },
  { id: "rose", name: "Rose", color: "#f43f5e" },
  { id: "amber", name: "Ambre", color: "#f59e0b" },
];

const Appearance = () => {
  const { toast } = useToast();
  const { value, setValue, save, ready } = useLocalSettings("appearance", {
    theme: "emerald", primary_color: "#10b981", font: "Inter", layout: "grid",
  });
  return (
    <SettingsSubPage title="Apparence & Thème" description="Personnalisez l'apparence de votre boutique."
      actions={<Button disabled={!ready} onClick={() => { save(value); toast({ title: "Apparence enregistrée" }); }}>Enregistrer</Button>}>
      <Card><CardContent className="p-6 space-y-6">
        <div>
          <Label className="mb-3 block">Palette</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {themes.map(t => (
              <button key={t.id} type="button" onClick={() => setValue({ ...value, theme: t.id, primary_color: t.color })}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${value.theme === t.id ? "border-primary ring-2 ring-primary/30" : "border-border"}`}>
                <span className="w-6 h-6 rounded-full" style={{ background: t.color }} />
                <span className="text-sm font-medium">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>Couleur principale</Label><Input type="color" value={value.primary_color} onChange={e => setValue({ ...value, primary_color: e.target.value })} /></div>
          <div><Label>Police</Label><Input value={value.font} onChange={e => setValue({ ...value, font: e.target.value })} /></div>
        </div>
      </CardContent></Card>
    </SettingsSubPage>
  );
};
export default Appearance;