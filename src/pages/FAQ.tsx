import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const faqs = [
  {
    question: "Comment créer ma boutique en ligne ?",
    answer: "C'est simple ! Inscrivez-vous gratuitement, puis suivez l'assistant de création de boutique. Vous pourrez personnaliser votre nom, logo, description et commencer à ajouter des produits en quelques minutes."
  },
  {
    question: "Quels moyens de paiement sont supportés ?",
    answer: "ShopEase supporte Stripe, PayPal, Orange Money, MTN MoMo, Wave, Flutterwave, CinetPay et le paiement à la livraison (Cash on Delivery). Vous pouvez activer ou désactiver chaque méthode depuis votre tableau de bord."
  },
  {
    question: "Combien coûte ShopEase ?",
    answer: "Nous proposons un plan gratuit pour démarrer avec 10 produits. Le plan Standard à 9 900 FCFA/mois offre 500 produits et tous les paiements mobiles. Le plan Premium à 24 900 FCFA/mois donne accès à des produits illimités et des fonctionnalités avancées."
  },
  {
    question: "Puis-je utiliser mon propre nom de domaine ?",
    answer: "Oui ! Avec les plans Standard et Premium, vous pouvez connecter votre propre nom de domaine (ex: www.maboutique.com) à votre boutique ShopEase."
  },
  {
    question: "Comment fonctionne la livraison ?",
    answer: "Vous configurez vos zones de livraison et tarifs depuis votre tableau de bord. Vous pouvez définir des prix par zone géographique ou par poids, et intégrer des services de livraison locaux."
  },
  {
    question: "Est-ce que je peux vendre dans plusieurs pays ?",
    answer: "Absolument ! ShopEase supporte le multilingue (français, anglais, etc.) et la multidevise avec conversion automatique. Vous pouvez vendre partout en Afrique et au-delà."
  },
  {
    question: "Comment contacter le support ?",
    answer: "Le plan gratuit donne accès au support communautaire. Les plans Standard et Premium incluent un support prioritaire par email et chat. Le plan Premium offre un support dédié 24/7."
  },
  {
    question: "Puis-je essayer avant de payer ?",
    answer: "Oui ! Le plan gratuit est disponible sans limite de temps. Les plans payants offrent un essai gratuit de 14 jours, sans carte bancaire requise."
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">FAQ</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4">Questions fréquentes</h1>
            <p className="text-muted-foreground text-lg">Tout ce que vous devez savoir sur ShopEase</p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-xl px-6 bg-card">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
