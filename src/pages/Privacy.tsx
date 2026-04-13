import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-8">Politique de Confidentialité</h1>

          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Collecte des données</h2>
              <p>Nous collectons les données nécessaires au fonctionnement de la plateforme : nom, email, informations de boutique et de commande. Aucune donnée n'est partagée avec des tiers sans votre consentement.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Utilisation des données</h2>
              <p>Vos données sont utilisées pour fournir et améliorer nos services, traiter les paiements et communications, et assurer la sécurité de la plateforme.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Protection des données</h2>
              <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données : chiffrement HTTPS, accès restreint et sauvegardes régulières.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Vos droits</h2>
              <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Contactez-nous à <strong className="text-foreground">privacy@shopease.com</strong> pour exercer ces droits.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Cookies</h2>
              <p>Nous utilisons des cookies essentiels au fonctionnement du site. Les cookies analytiques ne sont activés qu'avec votre consentement.</p>
            </section>
          </div>

          <p className="text-xs text-muted-foreground mt-8">Dernière mise à jour : Avril 2026</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
