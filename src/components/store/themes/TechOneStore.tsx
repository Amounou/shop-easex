import { Link } from "react-router-dom";
import { ShoppingCart, Search, Phone, ChevronRight, Menu, Heart, User } from "lucide-react";
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

const TechOneStore = ({
  store, products, categories, selectedCategory, setSelectedCategory,
  search, setSearch, onAdd, formatPrice,
}: Props) => {
  const { itemCount, setIsOpen } = useCart();

  const filtered = products.filter((p) => {
    const matchCat = !selectedCategory || p.category_id === selectedCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.slice(0, 10);
  const bestsellers = filtered.slice(10, 20);

  const discount = (p: Product) =>
    p.compare_at_price && p.compare_at_price > p.price
      ? Math.round((1 - p.price / p.compare_at_price) * 100)
      : null;

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#111] font-sans">
      {/* Top utility bar */}
      <div className="bg-white border-b border-gray-200 text-xs text-gray-600">
        <div className="container mx-auto flex items-center justify-between h-9 px-4">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">À propos</span>
            <span className="hidden sm:inline">Newsletter</span>
            <span className="hidden md:inline">Inscription / Connexion</span>
          </div>
          <div className="flex items-center gap-3">
            <span>FCFA</span>
            <span>Français</span>
          </div>
        </div>
      </div>

      {/* Header: logo + search + cart */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto flex items-center gap-4 md:gap-8 px-4 py-4">
          <button
            className="relative flex items-center gap-2"
            onClick={() => setIsOpen(true)}
            aria-label="Panier"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase">Panier</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 w-5 h-5 rounded-full bg-[#ef4444] text-white text-[11px] flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          <div className="hidden md:flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-[#ef4444]" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500">Appelez-nous</div>
              <div className="font-semibold">{store.phone || "+221 77 000 00 00"}</div>
            </div>
          </div>

          <div className="flex-1 max-w-2xl mx-auto">
            <div className="flex items-stretch border border-gray-200 rounded-full overflow-hidden bg-white">
              <button className="bg-[#ef4444] text-white px-4 flex items-center justify-center">
                <Search className="w-4 h-4" />
              </button>
              <select className="px-3 text-xs border-r border-gray-200 bg-white outline-none">
                <option>Toutes catégories</option>
                {categories.map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="flex-1 px-4 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.name} className="h-10 w-auto object-contain" />
            ) : (
              <div className="text-2xl font-black tracking-tight">
                {store.name.split(" ")[0]?.toUpperCase()}
                <span className="text-[#ef4444]">{store.name.split(" ")[1]?.toUpperCase() || ""}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Nav bar */}
      <nav className="bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto flex items-center px-4">
          <div className="bg-[#ef4444] text-white flex items-center gap-2 px-5 py-3 text-sm font-semibold uppercase">
            <Menu className="w-4 h-4" /> Catégories
          </div>
          <div className="flex-1 flex items-center gap-6 px-6 text-sm font-medium overflow-x-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className={!selectedCategory ? "text-[#ef4444]" : ""}
            >
              ACCUEIL
            </button>
            <a href="#featured">BOUTIQUE</a>
            <a href="#bestsellers">BESTSELLERS</a>
            <a href="#">BLOG</a>
            <a href="#">CONTACT</a>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <Heart className="w-4 h-4" />
            <User className="w-4 h-4" />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6 grid lg:grid-cols-[1fr,260px] gap-6">
        <div>
          {/* Hero banner */}
          <section className="bg-white rounded p-8 mb-6 flex items-center justify-between gap-6 relative overflow-hidden">
            <div className="max-w-sm">
              <div className="text-3xl font-black mb-2">
                <span className="text-[#ef4444]">JUSQU'À -60%</span>
              </div>
              <h2 className="text-2xl font-bold uppercase mb-2">{store.name}</h2>
              <p className="text-sm text-gray-600 mb-4">
                {store.description || "Découvrez nos meilleures offres du moment."}
              </p>
              <button
                className="bg-[#ef4444] text-white px-6 py-2.5 text-sm font-semibold uppercase rounded"
                onClick={() => document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })}
              >
                Acheter maintenant
              </button>
            </div>
            {featured[0]?.product_images?.[0]?.url && (
              <img
                src={featured[0].product_images[0].url}
                alt=""
                className="hidden md:block h-48 object-contain"
              />
            )}
          </section>

          {/* Featured products band */}
          <section id="featured" className="bg-white rounded mb-6">
            <div className="flex items-center justify-between border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-3 text-xs uppercase font-semibold ${!selectedCategory ? "text-[#ef4444]" : "text-gray-600"}`}
                >
                  Tout
                </button>
                {categories.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-4 py-3 text-xs uppercase font-semibold ${selectedCategory === c.id ? "text-[#ef4444]" : "text-gray-600"}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              <div className="bg-[#ef4444] text-white px-5 py-3 text-xs font-bold uppercase">
                Produits vedettes
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-gray-100">
              {featured.map((p) => {
                const img = p.product_images?.[0]?.url;
                const d = discount(p);
                return (
                  <div key={p.id} className="bg-white p-4 relative group">
                    {d && (
                      <span className="absolute top-2 left-2 bg-[#ef4444] text-white text-[10px] font-bold px-2 py-1 z-10">
                        {d}%
                      </span>
                    )}
                    <Link to={`/store/${store.slug}/product/${p.slug}`}>
                      <div className="aspect-square flex items-center justify-center bg-white mb-3">
                        {img ? (
                          <img src={img} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>
                      <h3 className="text-xs font-medium text-gray-800 text-center mb-2 line-clamp-2 min-h-[2rem] hover:text-[#ef4444]">
                        {p.name}
                      </h3>
                    </Link>
                    <div className="text-center">
                      <span className="text-[#ef4444] font-bold text-sm">{formatPrice(p.price)}</span>
                      {p.compare_at_price && p.compare_at_price > p.price && (
                        <span className="text-gray-400 text-xs line-through ml-2">{formatPrice(p.compare_at_price)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => onAdd(p)}
                      disabled={p.stock <= 0}
                      className="mt-3 w-full bg-gray-900 hover:bg-[#ef4444] text-white text-[11px] uppercase py-2 font-semibold disabled:opacity-50"
                    >
                      {p.stock <= 0 ? "Rupture" : "Ajouter"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Promo split */}
          <section className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded p-6 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-gray-500">Inspiration</div>
                <div className="text-2xl font-bold">Nouveautés</div>
                <div className="text-[#ef4444] font-bold mt-2">À partir de {featured[0] ? formatPrice(featured[0].price) : "—"}</div>
              </div>
              <ChevronRight className="w-8 h-8 text-gray-300" />
            </div>
            <div className="bg-white rounded p-6 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-gray-500">Série spéciale</div>
                <div className="text-2xl font-bold">Top ventes</div>
                <div className="text-[#ef4444] font-bold mt-2">{bestsellers[0] ? formatPrice(bestsellers[0].price) : "—"}</div>
              </div>
              <ChevronRight className="w-8 h-8 text-gray-300" />
            </div>
          </section>

          {/* Bestsellers band */}
          {bestsellers.length > 0 && (
            <section id="bestsellers" className="bg-white rounded mb-6">
              <div className="flex items-center justify-end border-b border-gray-200">
                <div className="bg-[#ef4444] text-white px-5 py-3 text-xs font-bold uppercase">
                  Meilleures ventes
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-gray-100">
                {bestsellers.map((p) => {
                  const img = p.product_images?.[0]?.url;
                  const d = discount(p);
                  return (
                    <div key={p.id} className="bg-white p-4 relative group">
                      {d && (
                        <span className="absolute top-2 left-2 bg-[#ef4444] text-white text-[10px] font-bold px-2 py-1 z-10">
                          {d}%
                        </span>
                      )}
                      <Link to={`/store/${store.slug}/product/${p.slug}`}>
                        <div className="aspect-square flex items-center justify-center bg-white mb-3">
                          {img ? (
                            <img src={img} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="w-full h-full bg-gray-100" />
                          )}
                        </div>
                        <h3 className="text-xs font-medium text-gray-800 text-center mb-2 line-clamp-2 min-h-[2rem] hover:text-[#ef4444]">
                          {p.name}
                        </h3>
                      </Link>
                      <div className="text-center">
                        <span className="text-[#ef4444] font-bold text-sm">{formatPrice(p.price)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar categories */}
        <aside className="hidden lg:block">
          <div className="bg-white rounded overflow-hidden">
            <div className="bg-[#ef4444] text-white px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase">Catégories</span>
              <Menu className="w-4 h-4" />
            </div>
            <ul className="divide-y divide-gray-100">
              <li>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-gray-50 ${!selectedCategory ? "text-[#ef4444] font-semibold" : ""}`}
                >
                  Toutes les catégories
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-gray-50 ${selectedCategory === c.id ? "text-[#ef4444] font-semibold" : ""}`}
                  >
                    {c.name}
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-8 mt-6">
        <div className="container mx-auto px-4 text-center text-sm">
          © {new Date().getFullYear()} {store.name}. Propulsé par ShopEase.
        </div>
      </footer>
    </div>
  );
};

export default TechOneStore;