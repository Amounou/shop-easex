import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Package, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useUserStore } from "@/hooks/useUserStore";

const DashboardHome = () => {
  const { store, storeId, loading: storeLoading } = useUserStore();
  const [stats, setStats] = useState({ sales: 0, orders: 0, products: 0 });

  useEffect(() => {
    if (!storeId) return;
    const load = async () => {
      const [{ count: productCount }, { data: orders }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }).eq("store_id", storeId),
        supabase.from("orders").select("total").eq("store_id", storeId),
      ]);
      const totalSales = orders?.reduce((sum, o) => sum + o.total, 0) ?? 0;
      setStats({
        sales: totalSales,
        orders: orders?.length ?? 0,
        products: productCount ?? 0,
      });
    };
    load();
  }, [storeId]);

  const formatPrice = (p: number) => new Intl.NumberFormat("fr-FR").format(p) + " FCFA";

  const cards = [
    { label: "Ventes totales", value: formatPrice(stats.sales), icon: BarChart3 },
    { label: "Commandes", value: String(stats.orders), icon: ShoppingCart },
    { label: "Produits", value: String(stats.products), icon: Package },
  ];

  if (storeLoading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Tableau de bord</h1>
        <p className="text-muted-foreground">Voici un aperçu de votre activité</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {cards.map((s) => (
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

      {!store ? (
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
      ) : (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">Boutique : {store.name}</h2>
          <p className="text-muted-foreground">Gérez vos produits, commandes et paramètres depuis la barre latérale.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
