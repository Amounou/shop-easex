import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserStore } from "@/hooks/useUserStore";
import { SettingsSubPage } from "./SettingsSubPage";

const DeleteAccount = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { store } = useUserStore();
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm !== "SUPPRIMER") return toast({ title: "Veuillez taper SUPPRIMER pour confirmer", variant: "destructive" });
    setLoading(true);
    if (store) await supabase.from("stores").delete().eq("id", store.id);
    await supabase.auth.signOut();
    setLoading(false);
    toast({ title: "Compte désactivé", description: "Vos données ont été supprimées." });
    navigate("/");
  };

  return (
    <SettingsSubPage title="Suppression du compte" description="Cette action est irréversible.">
      <Card className="border-destructive/40"><CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
          <p className="text-sm">La suppression effacera définitivement votre boutique, vos produits et vos données. Cette action ne peut pas être annulée.</p>
        </div>
        <div><Label>Tapez <strong>SUPPRIMER</strong> pour confirmer</Label><Input value={confirm} onChange={e => setConfirm(e.target.value)} /></div>
        <Button variant="destructive" disabled={loading || confirm !== "SUPPRIMER"} onClick={handleDelete}>{loading ? "Suppression..." : "Supprimer mon compte"}</Button>
      </CardContent></Card>
    </SettingsSubPage>
  );
};
export default DeleteAccount;