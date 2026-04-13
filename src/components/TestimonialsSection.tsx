import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Aminata Diallo",
    role: "Fondatrice, AfrikaMode",
    content: "ShopEase m'a permis de lancer ma boutique de mode en seulement 2 jours. L'intégration d'Orange Money est un vrai plus pour mes clientes !",
    rating: 5,
  },
  {
    name: "Kofi Mensah",
    role: "CEO, TechGadgets GH",
    content: "Le tableau de bord est incroyable. Je suis passé de 50 à 500 commandes par mois grâce aux outils de ShopEase.",
    rating: 5,
  },
  {
    name: "Fatou Ndiaye",
    role: "Artisane, Teranga Craft",
    content: "Enfin une plateforme qui comprend le commerce africain. Le paiement à la livraison et Wave ont doublé mes ventes.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Témoignages</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4">
            Ils ont choisi ShopEase
          </h2>
          <p className="text-muted-foreground text-lg">
            Découvrez comment nos marchands réussissent en ligne
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="p-6 rounded-2xl border border-border bg-card hover:shadow-md transition-all">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-card-foreground leading-relaxed mb-4">"{t.content}"</p>
              <div>
                <div className="font-semibold text-sm text-card-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
