import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-8">Conditions Générales d'Utilisation</h1>
          
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Objet</h2>
              <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme ShopEase, un service SaaS de création de boutiques en ligne.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Inscription</h2>
              <p>Pour utiliser ShopEase, vous devez créer un compte en fournissant des informations exactes et à jour. Vous êtes responsable de la confidentialité de vos identifiants de connexion.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Services</h2>
              <p>ShopEase fournit des outils de création et de gestion de boutiques en ligne, incluant la gestion des produits, des commandes, des paiements et des livraisons. Les fonctionnalités disponibles dépendent du plan d'abonnement choisi.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Abonnements et Paiements</h2>
              <p>Les abonnements sont facturés mensuellement ou annuellement. Le renouvellement est automatique sauf résiliation. Les prix sont indiqués en FCFA et peuvent être modifiés avec un préavis de 30 jours.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Responsabilités</h2>
              <p>Chaque marchand est responsable du contenu de sa boutique, de la qualité de ses produits et du respect de la législation en vigueur dans son pays d'activité.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Contact</h2>
              <p>Pour toute question concernant ces conditions, contactez-nous à <strong className="text-foreground">support@shopease.com</strong>.</p>
            </section>
          </div>

          <p className="text-xs text-muted-foreground mt-8">Dernière mise à jour : Avril 2026</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
