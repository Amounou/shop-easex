import { Zap } from "lucide-react";

const DashboardAutomations = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-foreground mb-1">Automatisations</h1>
    <p className="text-muted-foreground mb-6">Automatisez vos tâches récurrentes</p>
    <div className="text-center py-16 bg-card rounded-xl border border-border">
      <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">Les automatisations seront disponibles prochainement</p>
      <p className="text-xs text-muted-foreground mt-1">Notifications, emails automatiques, etc.</p>
    </div>
  </div>
);

export default DashboardAutomations;
