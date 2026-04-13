import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, MessageCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const helpTopics = [
  { icon: BookOpen, title: "Premiers pas", description: "Apprenez à créer et configurer votre boutique.", link: "/faq" },
  { icon: MessageCircle, title: "FAQ", description: "Réponses aux questions les plus fréquentes.", link: "/faq" },
  { icon: Mail, title: "Nous contacter", description: "Envoyez-nous un message, nous répondons sous 24h.", link: "mailto:support@shopease.com" },
];

const HelpCenter = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Centre d'aide</h1>
            <p className="text-muted-foreground text-lg mb-6">Comment pouvons-nous vous aider ?</p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Rechercher dans l'aide..." className="pl-10 h-12 rounded-xl" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {helpTopics.map((topic) => (
              <Link
                key={topic.title}
                to={topic.link}
                className="p-6 rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/20 transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                  <topic.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{topic.title}</h3>
                <p className="text-sm text-muted-foreground">{topic.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
