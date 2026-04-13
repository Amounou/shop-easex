import { Store, CreditCard, Truck, BarChart3, Palette, Globe } from "lucide-react";

const features = [
  {
    icon: Store,
    title: "Boutique personnalisable",
    description: "Créez une boutique unique avec des thèmes professionnels et un éditeur drag-and-drop intuitif.",
  },
  {
    icon: CreditCard,
    title: "Paiements africains",
    description: "Acceptez Orange Money, MTN MoMo, Wave, Stripe, PayPal et le paiement à la livraison.",
  },
  {
    icon: Truck,
    title: "Gestion des livraisons",
    description: "Configurez vos zones de livraison, tarifs et intégrez des services de livraison locaux.",
  },
  {
    icon: BarChart3,
    title: "Analytique avancée",
    description: "Suivez vos ventes, commandes et performances avec des tableaux de bord interactifs.",
  },
  {
    icon: Palette,
    title: "Design sur mesure",
    description: "Personnalisez couleurs, polices et mise en page. Aperçu en temps réel sur tous les écrans.",
  },
  {
    icon: Globe,
    title: "Multilingue & multidevise",
    description: "Vendez en français, anglais et plus. Conversion automatique des devises.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Fonctionnalités</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4">
            Tout ce qu'il faut pour réussir en ligne
          </h2>
          <p className="text-muted-foreground text-lg">
            Des outils puissants conçus pour les entrepreneurs africains
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
