import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Gratuit",
    price: "0",
    currency: "FCFA",
    period: "/mois",
    description: "Idéal pour démarrer et tester la plateforme",
    features: [
      "10 produits maximum",
      "1 thème de base",
      "Paiement à la livraison",
      "Sous-domaine ShopEase",
      "Support communautaire",
    ],
    cta: "Commencer gratuitement",
    popular: false,
  },
  {
    name: "Standard",
    price: "9 900",
    currency: "FCFA",
    period: "/mois",
    description: "Pour les boutiques en pleine croissance",
    features: [
      "500 produits",
      "Tous les thèmes",
      "Paiements mobile money",
      "Domaine personnalisé",
      "Coupons & promotions",
      "Support prioritaire",
      "Rapports PDF/CSV",
    ],
    cta: "Essayer 14 jours gratuit",
    popular: true,
  },
  {
    name: "Premium",
    price: "24 900",
    currency: "FCFA",
    period: "/mois",
    description: "Pour les entreprises ambitieuses",
    features: [
      "Produits illimités",
      "Thèmes personnalisables",
      "Tous les paiements",
      "Multi-boutiques",
      "API complète",
      "Support dédié 24/7",
      "Analytique avancée",
      "Commission réduite",
    ],
    cta: "Essayer 14 jours gratuit",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Tarifs</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4">
            Des prix adaptés à chaque étape
          </h2>
          <p className="text-muted-foreground text-lg">
            Commencez gratuitement, évoluez à votre rythme
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border bg-card transition-all duration-300 ${
                plan.popular
                  ? "border-primary shadow-glow scale-[1.02]"
                  : "border-border hover:border-primary/20 hover:shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full">
                    Le plus populaire
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-card-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground ml-1">
                  {plan.currency}{plan.period}
                </span>
              </div>

              <Button
                variant={plan.popular ? "hero" : "hero-outline"}
                className="w-full mb-6"
                size="lg"
              >
                {plan.cta}
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
