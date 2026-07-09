import { Link } from "react-router-dom";
import { ShoppingCart, Search, Truck, ShieldCheck, Headphones, Tag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products"> & { product_images: Tables<"product_images">[] };
type Category = Tables<"categories">;
type Store = Tables<"stores">;

interface Props {
  store: Store;
  products: Product[];
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;
  search: string;
  setSearch: (v: string) => void;
  onAdd: (p: Product) => void;
  formatPrice: (n: number) => string;
}

const ClassicStore = ({
  store, products, categories, selectedCategory, setSelectedCategory,
  search, setSearch, onAdd, formatPrice,
}: Props) => {
  const { itemCount, setIsOpen } = useCart();

  const filtered = products.filter((p) => {
    const matchCat = !selectedCategory || p.category_id === selectedCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans">
      {/* Top strip */}
      <div className="bg-[#1e3a8a] text-white text-xs">
        <div className="container mx-auto flex items-center justify-between h-9 px-4">
          <span>Livraison offerte dès 25 000 FCFA · Paiement à la livraison disponible</span>
          <span className="hidden md:inline">{store.phone || "Contactez-nous"}</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto flex items-center gap-6 px-4 py-4">
          <div className="flex items-center gap-3">
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.name} className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-md bg-[#1e3a8a] text-white flex items-center justify-center font-bold">
                {store.name.charAt(0)}
              </div>
            )}
            <span className="text-xl font-bold tracking-tight">{store.name}</span>
          </div>

          <div className="flex-1 max-w-2xl mx-auto">
            <div className="flex items-stretch border-2 border-[#1e3a8a] rounded-md overflow-hidden bg-white">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un produit..."
                className="flex-1 px-4 text-sm outline-none"
              />
              <button className="bg-[#1e3a8a] text-white px-5 flex items-center justify-center">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            className="relative flex items-center gap-2 bg-[#1e3a8a] text-white px-4 py-2 rounded-md"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-semibold hidden sm:inline">Panier</span>
            {itemCount > 0 && (
              <span className="ml-1 bg-white text-[#1e3a8a] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Categories nav */}
        <div className="border-t border-gray-100 bg-white">
          <div className="container mx-auto flex items-center gap-6 px-4 py-2 overflow-x-auto text-sm">
            <button
              onClick={() => setSelectedCategory(null)}
              className={!selectedCategory ? "text-[#1e3a8a] font-semibold" : "text-gray-600"}
            >
              Tous les produits
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={selectedCategory === c.id ? "text-[#1e3a8a] font-semibold" : "text-gray-600 hover:text-[#1e3a8a]"}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{store.name}</h1>
          <p className="text-blue-100 max-w-xl mx-auto">
            {store.description || "Vos produits favoris au meilleur prix, livrés rapidement."}
          </p>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4 py-6 text-sm">
          {[
            { icon: Truck, label: "Livraison rapide" },
            { icon: ShieldCheck, label: "Paiement sécurisé" },
            { icon: Headphones, label: "Support 7j/7" },
            { icon: Tag, label: "Prix imbattables" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="w-6 h-6 text-[#1e3a8a]" />
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold border-l-4 border-[#1e3a8a] pl-3 mb-6">
          {selectedCategory
            ? categories.find((c) => c.id === selectedCategory)?.name
            : "Notre sélection"}
        </h2>
        {filtered.length === 0 ? (
          <p className="text-center py-16 text-gray-500">Aucun produit trouvé</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => {
              const img = p.product_images?.[0]?.url;
              const discount = p.compare_at_price && p.compare_at_price > p.price
                ? Math.round((1 - p.price / p.compare_at_price) * 100) : null;
              return (
                <div key={p.id} className="bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/store/${store.slug}/product/${p.slug}`}>
                    <div className="aspect-square bg-gray-50 relative">
                      {img ? (
                        <img src={img} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full" />
                      )}
                      {discount && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          -{discount}%
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-3">
                    <Link to={`/store/${store.slug}/product/${p.slug}`}>
                      <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem] hover:text-[#1e3a8a]">{p.name}</h3>
                    </Link>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-[#1e3a8a] font-bold">{formatPrice(p.price)}</span>
                      {p.compare_at_price && p.compare_at_price > p.price && (
                        <span className="text-xs text-gray-400 line-through">{formatPrice(p.compare_at_price)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => onAdd(p)}
                      disabled={p.stock <= 0}
                      className="mt-3 w-full bg-[#1e3a8a] text-white text-sm font-semibold py-2 rounded hover:bg-[#1e40af] disabled:opacity-50"
                    >
                      {p.stock <= 0 ? "Rupture" : "Ajouter au panier"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="bg-[#0f172a] text-gray-300 py-8 mt-6">
        <div className="container mx-auto px-4 text-center text-sm">
          © {new Date().getFullYear()} {store.name}. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};

export default ClassicStore;