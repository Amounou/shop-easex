import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SettingsSubPage } from "./SettingsSubPage";
import { useLocalSettings } from "./useLocalSettings";

type Page = { id: string; title: string; slug: string; content: string };

const Pages = () => {
  const { toast } = useToast();
  const { value, save, ready } = useLocalSettings<{ pages: Page[] }>("pages", {
    pages: [
      { id: "1", title: "Mentions légales", slug: "mentions-legales", content: "" },
      { id: "2", title: "Politique de confidentialité", slug: "confidentialite", content: "" },
    ],
  });
  const update = (id: string, patch: Partial<Page>) =>
    save({ pages: value.pages.map(p => p.id === id ? { ...p, ...patch } : p) });
  const add = () => save({ pages: [...value.pages, { id: Date.now().toString(), title: "Nouvelle page", slug: "nouvelle-page", content: "" }] });
  const remove = (id: string) => save({ pages: value.pages.filter(p => p.id !== id) });
  return (
    <SettingsSubPage title="Pages" description="Créez et gérez les pages de contenu de votre boutique."
      actions={<Button disabled={!ready} onClick={add}><Plus className="h-4 w-4 mr-1" />Ajouter</Button>}>
      {value.pages.map(p => (
        <Card key={p.id}><CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Input className="font-semibold" value={p.title} onChange={e => update(p.id, { title: e.target.value })} />
            <Button variant="ghost" size="icon" onClick={() => { remove(p.id); toast({ title: "Page supprimée" }); }}><Trash2 className="h-4 w-4" /></Button>
          </div>
          <Input value={p.slug} onChange={e => update(p.id, { slug: e.target.value })} placeholder="slug" />
          <Textarea rows={5} value={p.content} onChange={e => update(p.id, { content: e.target.value })} placeholder="Contenu..." />
        </CardContent></Card>
      ))}
    </SettingsSubPage>
  );
};
export default Pages;