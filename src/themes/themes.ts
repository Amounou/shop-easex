export type StoreThemeId = "default" | "techone" | "luxe" | "midnight" | "atelier";

export type StoreTheme = {
  id: StoreThemeId;
  name: string;
  description: string;
  tier: "free" | "premium";
  preview: { bg: string; accent: string; text: string };
};

export const STORE_THEMES: StoreTheme[] = [
  {
    id: "default",
    name: "Émeraude (par défaut)",
    description: "Le thème ShopEase original, épuré et moderne.",
    tier: "free",
    preview: { bg: "#ffffff", accent: "#10b981", text: "#0f172a" },
  },
  {
    id: "techone",
    name: "TechOne",
    description: "Boutique high-tech façon marketplace : bandeau rouge, grille produits dense, badges promo.",
    tier: "free",
    preview: { bg: "#f5f5f5", accent: "#ef4444", text: "#111111" },
  },
  {
    id: "luxe",
    name: "Luxe Or",
    description: "Éditorial haut de gamme — noir profond, typographie serif, accents dorés.",
    tier: "premium",
    preview: { bg: "#0d0d0d", accent: "#c9a84c", text: "#f5f0e0" },
  },
  {
    id: "midnight",
    name: "Midnight Pro",
    description: "SaaS premium sombre, parfait pour le digital et les produits tech.",
    tier: "premium",
    preview: { bg: "#0a0a1a", accent: "#4f46e5", text: "#ffffff" },
  },
  {
    id: "atelier",
    name: "Atelier",
    description: "Style boutique d'artisan, tons terre et terracotta, photos mises en avant.",
    tier: "premium",
    preview: { bg: "#faf8f5", accent: "#c4654a", text: "#3a2a20" },
  },
];

export const getTheme = (id?: string | null): StoreTheme =>
  STORE_THEMES.find((t) => t.id === id) ?? STORE_THEMES[0];