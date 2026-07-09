import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, ShoppingCart, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import CartDrawer from "@/components/CartDrawer";
import type { Tables } from "@/integrations/supabase/types";
import TechOneStore from "@/components/store/themes/TechOneStore";

type Product = Tables<"products"> & { product_images: Tables<"product_images">[] };
type Category = Tables<"categories">;
type Store = Tables<"stores">;

const StorePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem, itemCount, setIsOpen } = useCart();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let storeData = null;

      if (slug) {
        // Public storefront lookup (excludes sensitive contact columns)
        const { data } = await (supabase as any).rpc("get_public_store_by_slug", { _slug: slug });
        storeData = Array.isArray(data) ? data[0] ?? null : data;
      } else {
        // No slug: load only the current user's own store
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data } = await supabase.from("stores").select("*").eq("owner_id", session.user.id).limit(1).single();
          storeData = data;
        }
      }

      if (!storeData) { setLoading(false); return; }
      setStore(storeData);

      const [{ data: prods }, { data: cats }] = await Promise.all([
        supabase
          .from("products")
          .select("*, product_images(*)")
          .eq("store_id", storeData.id)
          .eq("status", "active")
          .order("created_at", { ascending: false }),
        supabase
          .from("categories")
          .select("*")
          .eq("store_id", storeData.id)
          .order("sort_order"),
      ]);
      setProducts((prods as Product[]) || []);
      setCategories(cats || []);
      setLoading(false);
    };
    load();
  }, [slug]);

  const filtered = products.filter((p) => {
    const matchCat = !selectedCategory || p.category_id === selectedCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR", { style: "decimal" }).format(price) + " FCFA";

  const handleAdd = (p: Product) => {
    const img = p.product_images?.[0]?.url;
    addItem({ productId: p.id, name: p.name, price: p.price, quantity: 1, image: img });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground" />
        <h1 className="text-xl font-semibold text-foreground">Boutique introuvable</h1>
        <Link to="/"><Button>Retour à l'accueil</Button></Link>
      </div>
    );
  }

  // Theme dispatch
  const themedProps = {
    store, products, categories, selectedCategory, setSelectedCategory,
    search, setSearch, onAdd: handleAdd, formatPrice,
  };
  if ((store as any).theme === "techone") {
    return (<><CartDrawer /><TechOneStore {...themedProps} /></>);
  }

  return (
    <div className="min-h-screen bg-background">
      <CartDrawer />

      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.name} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <span className="text-lg font-bold text-foreground">{store.name}</span>
          </div>
          <Button variant="outline" size="sm" className="relative" onClick={() => setIsOpen(true)}>
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Panier</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-hero py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">{store.name}</h1>
          {store.description && (
            <p className="text-muted-foreground max-w-lg mx-auto">{store.description}</p>
          )}
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Tout
              </Button>
              {categories.map((c) => (
                <Button
                  key={c.id}
                  variant={selectedCategory === c.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(c.id)}
                >
                  {c.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p) => {
              const img = p.product_images?.[0]?.url;
              return (
                <div
                  key={p.id}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <Link to={`/store/${store.slug}/product/${p.slug}`}>
                    <div className="aspect-square bg-secondary overflow-hidden">
                      {img ? (
                        <img
                          src={img}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-3 md:p-4">
                    <Link to={`/store/${store.slug}/product/${p.slug}`}>
                      <h3 className="font-semibold text-foreground text-sm md:text-base truncate hover:text-primary transition-colors">
                        {p.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-primary text-sm md:text-base">
                        {formatPrice(p.price)}
                      </span>
                      {p.compare_at_price && p.compare_at_price > p.price && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(p.compare_at_price)}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="hero"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => handleAdd(p)}
                      disabled={p.stock <= 0}
                    >
                      {p.stock <= 0 ? "Rupture" : "Ajouter au panier"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default StorePage;
