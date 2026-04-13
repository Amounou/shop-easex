import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardExports = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-foreground mb-1">Exports</h1>
    <p className="text-muted-foreground mb-6">Exportez vos données</p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        { title: "Commandes", desc: "Exportez toutes vos commandes en CSV" },
        { title: "Produits", desc: "Exportez votre catalogue produits" },
        { title: "Clients", desc: "Exportez la liste de vos clients" },
      ].map((e) => (
        <div key={e.title} className="bg-card rounded-xl border border-border p-6">
          <Download className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-semibold text-foreground mb-1">{e.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{e.desc}</p>
          <Button variant="outline" size="sm">Exporter</Button>
        </div>
      ))}
    </div>
  </div>
);

export default DashboardExports;
