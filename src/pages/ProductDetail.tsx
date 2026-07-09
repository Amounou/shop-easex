import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";
import CartDrawer from "@/components/CartDrawer";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products"> & {
  product_images: Tables<"product_images">[];
  product_variants: Tables<"product_variants">[];
};

const ProductDetail = () => {
  const { slug, productSlug } = useParams();
  const { addItem, itemCount, setIsOpen } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: storeRows } = await (supabase as any).rpc("get_public_store_by_slug", { _slug: slug || "" });
      const storeData = Array.isArray(storeRows) ? storeRows[0] : storeRows;
      if (!storeData) { setLoading(false); return; }
      setStoreName(storeData.name);

      const { data } = await supabase
        .from("products")
        .select("*, product_images(*), product_variants(*)")
        .eq("store_id", storeData.id)
        .eq("slug", productSlug || "")
        .single();
      setProduct(data as Product | null);
      setLoading(false);
    };
    load();
  }, [slug, productSlug]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR", { style: "decimal" }).format(price) + " FCFA";

  const variant = product?.product_variants?.find((v) => v.id === selectedVariant);
  const finalPrice = product ? product.price + (variant?.price_adjustment || 0) : 0;

  const handleAdd = () => {
    if (!product) return;
    const img = product.product_images?.[0]?.url;
    addItem({
      productId: product.id,
      variantId: variant?.id,
      name: product.name,
      variantName: variant ? `${variant.name}: ${variant.value}` : undefined,
      price: finalPrice,
      quantity,
      image: img,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground" />
        <h1 className="text-xl font-semibold text-foreground">Produit introuvable</h1>
        <Link to={`/store/${slug}`}><Button>Retour à la boutique</Button></Link>
      </div>
    );
  }

  const images = product.product_images?.sort((a, b) => a.sort_order - b.sort_order) || [];

  return (
    <div className="min-h-screen bg-background">
      <CartDrawer />

      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to={`/store/${slug}`} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold">{storeName}</span>
          </Link>
          <Button variant="outline" size="sm" className="relative" onClick={() => setIsOpen(true)}>
            <ShoppingCart className="w-4 h-4" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-square bg-secondary rounded-xl overflow-hidden mb-3">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      i === selectedImage ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-primary">{formatPrice(finalPrice)}</span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
            )}

            {/* Variants */}
            {product.product_variants && product.product_variants.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-2">Options</p>
                <div className="flex flex-wrap gap-2">
                  {product.product_variants.map((v) => (
                    <Button
                      key={v.id}
                      variant={selectedVariant === v.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedVariant(selectedVariant === v.id ? null : v.id)}
                    >
                      {v.name}: {v.value}
                      {v.price_adjustment !== 0 && (
                        <span className="ml-1 text-xs">
                          ({v.price_adjustment > 0 ? "+" : ""}{formatPrice(v.price_adjustment)})
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-medium text-foreground mb-2">Quantité</p>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className={`text-sm ${product.stock > 0 ? "text-primary" : "text-destructive"}`}>
                {product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}
              </span>
            </div>

            <Button
              variant="hero"
              size="xl"
              className="w-full"
              onClick={handleAdd}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="w-5 h-5" />
              Ajouter au panier — {formatPrice(finalPrice * quantity)}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
