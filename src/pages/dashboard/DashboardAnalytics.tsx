import { BarChart3, TrendingUp, Users, Eye } from "lucide-react";

const DashboardAnalytics = () => {
  const metrics = [
    { label: "Visites", value: "0", icon: Eye },
    { label: "Taux de conversion", value: "0%", icon: TrendingUp },
    { label: "Visiteurs uniques", value: "0", icon: Users },
    { label: "Pages vues", value: "0", icon: BarChart3 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-1">Analytiques</h1>
      <p className="text-muted-foreground mb-6">Performances de votre boutique</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="bg-card rounded-xl border border-border p-6">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-3">
              <m.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{m.value}</p>
            <p className="text-sm text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Les graphiques d'analytiques apparaîtront ici avec plus de données</p>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
