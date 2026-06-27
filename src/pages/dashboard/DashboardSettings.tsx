import { Link } from "react-router-dom";
import {
  Settings, UserSquare2, Palette, Globe, StickyNote, Search, Code2,
  Bell, Headphones, User, Users, CreditCard, UserCog, Trash2, ArrowRight, ArrowUpRight
} from "lucide-react";

type Item = {
  title: string;
  desc: string;
  icon: React.ElementType;
  to: string;
  iconBg: string;
  iconColor: string;
  badge?: string;
  external?: boolean;
};

const sections: { title: string; items: Item[] }[] = [
  {
    title: "Boutique",
    items: [
      { title: "Identité de la boutique", desc: "Définissez le nom, le logo, la description et les réseaux sociaux de votre boutique.", icon: Settings, to: "/dashboard/settings/identity", iconBg: "bg-rose-100", iconColor: "text-rose-500" },
      { title: "Profil du Créateur", desc: "Personnalisez votre profil créateur pour mettre en valeur votre expertise et vous connecter avec les clients.", icon: UserSquare2, to: "/dashboard/settings/creator-profile", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", badge: "Nouveau" },
      { title: "Apparence & Thème", desc: "Modifiez le thème, les couleurs, la typographie et la mise en page de votre boutique.", icon: Palette, to: "/dashboard/settings/appearance", iconBg: "bg-yellow-100", iconColor: "text-yellow-600", badge: "Nouveau" },
      { title: "Nom de domaine", desc: "Connectez et personnalisez le nom de domaine de votre boutique.", icon: Globe, to: "/dashboard/settings/domain", iconBg: "bg-teal-100", iconColor: "text-teal-600" },
      { title: "Pages", desc: "Créez et gérez vos pages de contenu (mentions légales, politique de confidentialité, etc.).", icon: StickyNote, to: "/dashboard/settings/pages", iconBg: "bg-violet-100", iconColor: "text-violet-600" },
    ],
  },
  {
    title: "Marketing",
    items: [
      { title: "SEO & Référencement", desc: "Optimisez les titres, descriptions et métadonnées pour les moteurs de recherche.", icon: Search, to: "/dashboard/settings/seo", iconBg: "bg-sky-100", iconColor: "text-sky-600" },
      { title: "Pixels et Tracking", desc: "Connectez Facebook Pixel, Google Tag Manager, TikTok Pixel et ajoutez vos propres scripts de suivi.", icon: Code2, to: "/dashboard/settings/tracking", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
    ],
  },
  {
    title: "Communication",
    items: [
      { title: "Notifications", desc: "Gérez les alertes email et Telegram pour suivre l'activité de votre boutique.", icon: Bell, to: "/dashboard/settings/notifications", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
      { title: "Support client", desc: "Configurez vos informations de contact et les options de support pour vos clients.", icon: Headphones, to: "/dashboard/settings/support", iconBg: "bg-yellow-100", iconColor: "text-yellow-600" },
    ],
  },
  {
    title: "Comptes",
    items: [
      { title: "Mon Profil", desc: "Gérez vos informations personnelles, mot de passe et préférences de connexion.", icon: User, to: "/dashboard/settings/profile", iconBg: "bg-yellow-100", iconColor: "text-yellow-600", external: true },
      { title: "Équipe & Collaborateurs", desc: "Gérez vos collaborateurs, ajoutez de nouveaux membres et suivez leur activité sur votre boutique.", icon: Users, to: "/dashboard/settings/team", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
      { title: "Facturation", desc: "Suivez votre progression et augmentez vos revenus", icon: CreditCard, to: "/dashboard/settings/billing", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
      { title: "Transferts de propriété", desc: "Gérez les demandes de transfert de propriété de la boutique et suivez leur statut.", icon: UserCog, to: "/dashboard/settings/transfers", iconBg: "bg-rose-100", iconColor: "text-rose-500", badge: "Nouveau" },
      { title: "Suppression du compte", desc: "Gérez votre compte personnel, y compris sa suppression.", icon: Trash2, to: "/dashboard/settings/delete-account", iconBg: "bg-pink-100", iconColor: "text-pink-500" },
    ],
  },
];

const SettingCard = ({ item }: { item: Item }) => {
  const Icon = item.icon;
  const Arrow = item.external ? ArrowUpRight : ArrowRight;
  return (
    <Link
      to={item.to}
      className="group relative flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md"
    >
      {item.badge && (
        <span className="absolute -top-2 right-4 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white">
          {item.badge}
        </span>
      )}
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}>
        <Icon className={`h-5 w-5 ${item.iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground">{item.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.desc}</p>
      </div>
      <Arrow className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
};

const DashboardSettings = () => {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-1">Paramètres</h1>
      <p className="text-muted-foreground mb-8">Configurez votre boutique et votre compte</p>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-4 font-serif text-2xl text-foreground">{section.title}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {section.items.map((item) => (
                <SettingCard key={item.title} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default DashboardSettings;
