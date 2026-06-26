import { Link } from "react-router-dom";
import logo from "@/assets/logo-shopease.png.asset.json";

const Footer = () => {
  return (
    <footer className="py-16 bg-foreground">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo.url} alt="ShopEase" className="h-9 w-auto bg-background rounded-md p-1" />
            </Link>
            <p className="text-sm text-background/60 leading-relaxed">
              La plateforme e-commerce pensée pour l'Afrique. Créez, vendez, grandissez.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm">Produit</h4>
            <ul className="space-y-2">
              <li><button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-background/60 hover:text-background transition-colors">Fonctionnalités</button></li>
              <li><button onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-background/60 hover:text-background transition-colors">Tarifs</button></li>
              <li><Link to="/signup" className="text-sm text-background/60 hover:text-background transition-colors">Créer ma boutique</Link></li>
              <li><Link to="/login" className="text-sm text-background/60 hover:text-background transition-colors">Se connecter</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm">Ressources</h4>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-sm text-background/60 hover:text-background transition-colors">Centre d'aide</Link></li>
              <li><Link to="/faq" className="text-sm text-background/60 hover:text-background transition-colors">FAQ</Link></li>
              <li><Link to="/help" className="text-sm text-background/60 hover:text-background transition-colors">Documentation</Link></li>
              <li><Link to="/help" className="text-sm text-background/60 hover:text-background transition-colors">Communauté</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm">Légal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-sm text-background/60 hover:text-background transition-colors">Conditions générales</Link></li>
              <li><Link to="/privacy" className="text-sm text-background/60 hover:text-background transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="/terms" className="text-sm text-background/60 hover:text-background transition-colors">Mentions légales</Link></li>
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
