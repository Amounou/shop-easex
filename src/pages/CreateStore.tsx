import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, ArrowLeft, ArrowRight, Store, Palette, MapPin, Check, Upload, Crown, Sparkles, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  max_products: number | null;
}

const steps = [
  { icon: Crown, label: "Forfait" },
  { icon: Store, label: "Informations" },
  { icon: Palette, label: "Personnalisation" },
  { icon: MapPin, label: "Adresse & Contact" },
];

const currencies = [
  { value: "XOF", label: "FCFA (XOF)" },
  { value: "XAF", label: "FCFA (XAF)" },
  { value: "NGN", label: "Naira (NGN)" },
  { value: "GHS", label: "Cedi (GHS)" },
  { value: "KES", label: "Shilling (KES)" },
  { value: "USD", label: "Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
];

const countries = [
  "Sénégal", "Côte d'Ivoire", "Mali", "Burkina Faso", "Guinée", "Togo", "Bénin", "Niger",
  "Cameroun", "Gabon", "Congo", "RDC", "Nigeria", "Ghana", "Kenya", "Afrique du Sud", "Autre"
];

const planIcons: Record<string, typeof Crown> = {
  free: Zap,
  standard: Sparkles,
  premium: Crown,
};

const planColors: Record<string, string> = {
  free: "border-border hover:border-primary/50",
  standard: "border-primary/30 hover:border-primary ring-1 ring-primary/10",
  premium: "border-yellow-500/30 hover:border-yellow-500 ring-1 ring-yellow-500/10",
};

const planBadge: Record<string, string> = {
  free: "",
  standard: "Populaire",
  premium: "Meilleur choix",
};

const CreateStore = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    currency: "XOF",
    address: "",
    city: "",
    country: "Sénégal",
    phone: "",
    email: "",
    terms_conditions: "",
  });

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) navigate("/login");
      else setUserId(session.user.id);
    });
  }, [navigate]);

  useEffect(() => {
    supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) {
          const parsed = data.map((p) => ({
            ...p,
            features: Array.isArray(p.features) ? (p.features as string[]) : [],
          }));
          setPlans(parsed);
          // Auto-select standard plan
          const std = parsed.find((p) => p.slug === "standard");
          if (std) setSelectedPlanId(std.id);
          else if (parsed.length) setSelectedPlanId(parsed[0].id);
        }
      });
  }, []);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const canNext = () => {
    if (step === 0) return !!selectedPlanId;
    if (step === 1) return formData.name.trim().length >= 2;
    if (step === 2) return true;
    if (step === 3) return formData.city.trim().length > 0;
    return true;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratuit";
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const handleSubmit = async () => {
    if (!userId) return;
    const slug = generateSlug(formData.name);
    if (!slug) {
      toast({ title: "Erreur", description: "Le nom de la boutique n'est pas valide.", variant: "destructive" });
      return;
    }

    setLoading(true);

    // Add merchant role
    await supabase
      .from("user_roles")
      .upsert({ user_id: userId, role: "merchant" as any }, { onConflict: "user_id,role" });

    const { data: storeData, error } = await supabase.from("stores").insert({
      owner_id: userId,
      name: formData.name.trim(),
      slug,
      description: formData.description.trim() || null,
      currency: formData.currency,
      address: formData.address.trim() || null,
      city: formData.city.trim() || null,
      country: formData.country || null,
      phone: formData.phone.trim() || null,
      email: formData.email.trim() || null,
      terms_conditions: formData.terms_conditions.trim() || null,
      status: "active",
    }).select("id").single();

    if (error) {
      setLoading(false);
      if (error.code === "23505") {
        toast({ title: "Erreur", description: "Ce nom de boutique est déjà pris.", variant: "destructive" });
      } else {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      }
      return;
    }

    // Create subscription
    if (storeData) {
      const now = new Date().toISOString();
      const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await supabase.from("store_subscriptions").insert({
        store_id: storeData.id,
        plan_id: selectedPlanId,
        status: "active",
        current_period_start: now,
        current_period_end: periodEnd,
      });
    }

    setLoading(false);
    toast({ title: "Boutique créée ! 🎉", description: `"${formData.name}" est prête.` });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-hero">
      <header className="border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">ShopEase</span>
          </Link>
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Annuler
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-muted-foreground"
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${i < step ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          {/* Step 0: Plan Selection */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground mb-1">Choisissez votre forfait</h2>
                <p className="text-sm text-muted-foreground">Sélectionnez le plan qui correspond à vos besoins. Vous pourrez changer à tout moment.</p>
              </div>

              <div className="grid gap-4">
                {plans.map((plan) => {
                  const Icon = planIcons[plan.slug] || Zap;
                  const isSelected = selectedPlanId === plan.id;
                  const colorClass = planColors[plan.slug] || planColors.free;
                  const badge = planBadge[plan.slug];

                  return (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative text-left w-full p-5 rounded-xl border-2 transition-all ${colorClass} ${
                        isSelected ? "bg-primary/5 border-primary shadow-md" : "bg-card"
                      }`}
                    >
                      {badge && (
                        <span className={`absolute -top-2.5 right-4 px-3 py-0.5 rounded-full text-xs font-semibold ${
                          plan.slug === "premium"
                            ? "bg-yellow-500 text-yellow-950"
                            : "bg-primary text-primary-foreground"
                        }`}>
                          {badge}
                        </span>
                      )}

                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-foreground">{plan.name}</h3>
                            <div className="text-right">
                              <span className="text-lg font-bold text-foreground">{formatPrice(plan.price)}</span>
                              {plan.price > 0 && <span className="text-xs text-muted-foreground">/mois</span>}
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground mb-3">
                            {plan.max_products ? `Jusqu'à ${plan.max_products} produits` : "Produits illimités"}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {plan.features.map((f, i) => (
                              <span key={i} className="inline-flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-md text-muted-foreground">
                                <Check className="w-3 h-3 text-primary" />
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-1 flex items-center justify-center ${
                          isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Informations de votre boutique</h2>
                <p className="text-sm text-muted-foreground">Donnez un nom et une description à votre boutique</p>
              </div>
              <div>
                <Label htmlFor="name">Nom de la boutique *</Label>
                <Input id="name" placeholder="Ex: AfrikaMode, TechGadgets..." value={formData.name} onChange={(e) => updateField("name", e.target.value)} className="mt-1.5" maxLength={100} />
                {formData.name.trim() && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    URL : <span className="font-medium text-primary">{generateSlug(formData.name)}.shopease.com</span>
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Décrivez votre boutique..." value={formData.description} onChange={(e) => updateField("description", e.target.value)} className="mt-1.5" rows={3} maxLength={500} />
              </div>
              <div>
                <Label htmlFor="currency">Devise</Label>
                <Select value={formData.currency} onValueChange={(v) => updateField("currency", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (<SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Logo & Customization */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Personnalisation</h2>
                <p className="text-sm text-muted-foreground">Ajoutez un logo et personnalisez votre boutique</p>
              </div>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-10 hover:border-primary/30 transition-colors cursor-pointer">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Ajouter un logo</p>
                <p className="text-xs text-muted-foreground">PNG, JPG ou SVG · Max 2 Mo</p>
                <p className="text-xs text-muted-foreground mt-1">Vous pourrez ajouter votre logo plus tard</p>
              </div>
              <div>
                <Label htmlFor="terms">Conditions générales de vente (optionnel)</Label>
                <Textarea id="terms" placeholder="Vos conditions de vente, politique de retour, etc." value={formData.terms_conditions} onChange={(e) => updateField("terms_conditions", e.target.value)} className="mt-1.5" rows={4} maxLength={5000} />
              </div>
            </div>
          )}

          {/* Step 3: Address & Contact */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Adresse & Contact</h2>
                <p className="text-sm text-muted-foreground">Ces informations seront visibles sur votre boutique</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input id="city" placeholder="Dakar" value={formData.city} onChange={(e) => updateField("city", e.target.value)} className="mt-1.5" maxLength={100} />
                </div>
                <div>
                  <Label htmlFor="country">Pays</Label>
                  <Select value={formData.country} onValueChange={(v) => updateField("country", v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Adresse complète</Label>
                <Input id="address" placeholder="Quartier, rue, numéro..." value={formData.address} onChange={(e) => updateField("address", e.target.value)} className="mt-1.5" maxLength={255} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" type="tel" placeholder="+221 77 000 00 00" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className="mt-1.5" maxLength={20} />
                </div>
                <div>
                  <Label htmlFor="store-email">Email de la boutique</Label>
                  <Input id="store-email" type="email" placeholder="contact@maboutique.com" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className="mt-1.5" maxLength={255} />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>
              <ArrowLeft className="w-4 h-4" />
              Précédent
            </Button>

            {step < steps.length - 1 ? (
              <Button variant="hero" onClick={() => setStep(step + 1)} disabled={!canNext()}>
                Suivant
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="hero" onClick={handleSubmit} disabled={loading || !canNext()}>
                {loading ? "Création..." : "Créer ma boutique"}
                <Check className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateStore;
