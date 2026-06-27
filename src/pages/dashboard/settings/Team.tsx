import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SettingsSubPage } from "./SettingsSubPage";
import { useLocalSettings } from "./useLocalSettings";

type Member = { id: string; email: string; role: string; status: string };

const Team = () => {
  const { toast } = useToast();
  const { value, save, ready } = useLocalSettings<{ members: Member[] }>("team", { members: [] });
  const [email, setEmail] = useState(""); const [role, setRole] = useState("editor");

  const invite = () => {
    if (!email) return;
    save({ members: [...value.members, { id: Date.now().toString(), email, role, status: "invité" }] });
    setEmail(""); toast({ title: "Invitation envoyée", description: email });
  };
  const remove = (id: string) => save({ members: value.members.filter(m => m.id !== id) });

  return (
    <SettingsSubPage title="Équipe & Collaborateurs" description="Invitez et gérez les membres de votre équipe.">
      <Card><CardContent className="p-6 grid gap-3 md:grid-cols-[1fr_180px_auto]">
        <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ami@exemple.com" /></div>
        <div><Label>Rôle</Label>
          <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={role} onChange={e => setRole(e.target.value)}>
            <option value="editor">Éditeur</option><option value="viewer">Lecteur</option><option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex items-end"><Button disabled={!ready} onClick={invite}><UserPlus className="h-4 w-4 mr-1" />Inviter</Button></div>
      </CardContent></Card>
      <Card><CardContent className="p-6">
        {value.members.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Aucun collaborateur pour le moment.</p>
        ) : (
          <ul className="divide-y">{value.members.map(m => (
            <li key={m.id} className="flex items-center justify-between py-3">
              <div><p className="font-medium">{m.email}</p><p className="text-xs text-muted-foreground">{m.role}</p></div>
              <div className="flex items-center gap-2"><Badge variant="secondary">{m.status}</Badge>
                <Button variant="ghost" size="icon" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4" /></Button></div>
            </li>
          ))}</ul>
        )}
      </CardContent></Card>
    </SettingsSubPage>
  );
};
export default Team;