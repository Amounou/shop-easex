import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
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

const MinimalStore = ({
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
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="border-b border-black">
        <div className="container mx-auto flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            {store.logo_url && (
              <img src={store.logo_url} alt={store.name} className="h-8 w-auto object-contain" />
            )}
            <span className="text-2xl font-black tracking-tight uppercase">{store.name}</span>
          </div>
          <button
            className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider"
            onClick={() => setIsOpen(true)}
          >
            Panier ({itemCount})
          </button>
        </div>

        {/* Nav */}
        <nav className="border-t border-black">
          <div className="container mx-auto flex items-center gap-8 px-6 py-3 overflow-x-auto text-xs uppercase tracking-widest">
            <button
              onClick={() => setSelectedCategory(null)}
              className={!selectedCategory ? "font-bold underline underline-offset-4" : "text-gray-500 hover:text-black"}
            >
              Tout
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={selectedCategory === c.id ? "font-bold underline underline-offset-4" : "text-gray-500 hover:text-black"}
              >
                {c.name}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="border-b border-black">
        <div className="container mx-auto px-6 py-20 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">Boutique</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">{store.name}</h1>
          {store.description && (
            <p className="max-w-lg mx-auto text-gray-600">{store.description}</p>
          )}
          <div className="mt-8 max-w-md mx-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher"
              className="w-full border-b border-black bg-transparent py-2 text-center text-sm outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Products */}
      <main className="container mx-auto px-6 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm uppercase tracking-widest">Aucun produit</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filtered.map((p) => {
              const img = p.product_images?.[0]?.url;
              return (
                <div key={p.id} className="group">
                  <Link to={`/store/${store.slug}/product/${p.slug}`}>
                    <div className="aspect-[3/4] bg-gray-50 overflow-hidden mb-4">
                      {img ? (
                        <img
                          src={img}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <Link to={`/store/${store.slug}/product/${p.slug}`}>
                    <h3 className="text-sm font-medium uppercase tracking-wide hover:opacity-60">{p.name}</h3>
                  </Link>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm">{formatPrice(p.price)}</span>
                    {p.compare_at_price && p.compare_at_price > p.price && (
                      <span className="text-xs text-gray-400 line-through">{formatPrice(p.compare_at_price)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => onAdd(p)}
                    disabled={p.stock <= 0}
                    className="mt-3 w-full border border-black text-xs uppercase tracking-widest py-2 hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black"
                  >
                    {p.stock <= 0 ? "Épuisé" : "Ajouter"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="border-t border-black py-8">
        <div className="container mx-auto px-6 text-center text-xs uppercase tracking-widest text-gray-500">
          © {new Date().getFullYear()} {store.name}
        </div>
      </footer>
    </div>
  );
};

export default MinimalStore;