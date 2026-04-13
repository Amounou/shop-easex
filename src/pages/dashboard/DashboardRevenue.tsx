import { DollarSign, TrendingUp, CreditCard, ArrowUpRight } from "lucide-react";

const DashboardRevenue = () => {
  const cards = [
    { label: "Revenu total", value: "0 FCFA", icon: DollarSign, change: "+0%" },
    { label: "Revenu ce mois", value: "0 FCFA", icon: TrendingUp, change: "+0%" },
    { label: "Panier moyen", value: "0 FCFA", icon: CreditCard, change: "+0%" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-1">Revenus</h1>
      <p className="text-muted-foreground mb-6">Vue d'ensemble de vos revenus</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <c.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-primary flex items-center gap-1">
                {c.change} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{c.value}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Les graphiques de revenus apparaîtront ici une fois que vous aurez des ventes</p>
      </div>
    </div>
  );
};

export default DashboardRevenue;
