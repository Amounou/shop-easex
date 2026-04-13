import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#" + id);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">ShopEase</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection("features")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</button>
          <button onClick={() => scrollToSection("pricing")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tarifs</button>
          <button onClick={() => scrollToSection("testimonials")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Témoignages</button>
          <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login"><Button variant="ghost" size="sm">Se connecter</Button></Link>
          <Link to="/signup"><Button variant="hero" size="sm">Créer ma boutique</Button></Link>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3 animate-fade-in">
          <button onClick={() => scrollToSection("features")} className="block text-sm text-muted-foreground w-full text-left">Fonctionnalités</button>
          <button onClick={() => scrollToSection("pricing")} className="block text-sm text-muted-foreground w-full text-left">Tarifs</button>
          <button onClick={() => scrollToSection("testimonials")} className="block text-sm text-muted-foreground w-full text-left">Témoignages</button>
          <Link to="/faq" className="block text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>FAQ</Link>
          <div className="flex gap-2 pt-2">
            <Link to="/login" className="flex-1"><Button variant="ghost" size="sm" className="w-full">Se connecter</Button></Link>
            <Link to="/signup" className="flex-1"><Button variant="hero" size="sm" className="w-full">Créer ma boutique</Button></Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
