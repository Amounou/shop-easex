import { Link } from "react-router-dom";
import { ShoppingCart, Package, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardHome = () => {
  const stats = [
    { label: "Ventes totales", value: "0 FCFA", icon: BarChart3 },
    { label: "Commandes", value: "0", icon: ShoppingCart },
    { label: "Produits", value: "0", icon: Package },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Tableau de bord</h1>
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
    </div>
  );
};

export default DashboardHome;
