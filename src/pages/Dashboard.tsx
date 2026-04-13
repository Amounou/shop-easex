import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/login");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Déconnecté", description: "À bientôt !" });
    navigate("/");
  };

  if (!user) return null;

  const stats = [
    { label: "Ventes totales", value: "0 FCFA", icon: BarChart3 },
    { label: "Commandes", value: "0", icon: ShoppingCart },
    { label: "Produits", value: "0", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">ShopEase</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.user_metadata?.full_name || user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Bonjour, {user.user_metadata?.full_name?.split(" ")[0] || "Marchand"} 👋
          </h1>
          <p className="text-muted-foreground">Voici un aperçu de votre activité</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <LayoutDashboard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Bienvenue sur votre tableau de bord</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Commencez par créer votre première boutique pour vendre vos produits en ligne.
          </p>
          <Link to="/create-store">
            <Button variant="hero" size="lg">
              <Settings className="w-4 h-4" />
              Créer ma boutique
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
