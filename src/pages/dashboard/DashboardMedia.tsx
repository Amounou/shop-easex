import { Image } from "lucide-react";

const DashboardMedia = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-foreground mb-1">Médias</h1>
    <p className="text-muted-foreground mb-6">Gérez vos fichiers et images</p>
    <div className="text-center py-16 bg-card rounded-xl border border-border">
      <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">Glissez-déposez vos fichiers ici ou utilisez le gestionnaire de produits</p>
    </div>
  </div>
);

export default DashboardMedia;
