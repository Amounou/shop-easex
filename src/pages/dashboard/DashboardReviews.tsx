import { Star } from "lucide-react";

const DashboardReviews = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-foreground mb-1">Avis</h1>
    <p className="text-muted-foreground mb-6">Avis et évaluations de vos clients</p>
    <div className="text-center py-16 bg-card rounded-xl border border-border">
      <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">Les avis clients apparaîtront ici</p>
      <p className="text-xs text-muted-foreground mt-1">Fonctionnalité bientôt disponible</p>
    </div>
  </div>
);

export default DashboardReviews;
