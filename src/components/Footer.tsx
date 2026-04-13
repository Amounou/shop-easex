import { ShoppingBag } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 bg-foreground">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-background">ShopEase</span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              La plateforme e-commerce pensée pour l'Afrique. Créez, vendez, grandissez.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm">Produit</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-background/60 hover:text-background transition-colors">Fonctionnalités</a></li>
              <li><a href="#pricing" className="text-sm text-background/60 hover:text-background transition-colors">Tarifs</a></li>
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Thèmes</a></li>
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm">Ressources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Centre d'aide</a></li>
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Communauté</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm">Légal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Conditions générales</a></li>
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Mentions légales</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8">
          <p className="text-sm text-background/40 text-center">
            © {new Date().getFullYear()} ShopEase. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
