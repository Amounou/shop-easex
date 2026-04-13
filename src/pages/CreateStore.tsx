import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, ArrowLeft, ArrowRight, Store, Palette, MapPin, Check, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState as useStateAlias } from "react";

const steps = [
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

const CreateStore = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
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
    if (step === 0) return formData.name.trim().length >= 2;
    if (step === 1) return true;
    if (step === 2) return formData.city.trim().length > 0;
    return true;
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
    const { error: roleError } = await supabase
      .from("user_roles")
      .upsert({ user_id: userId, role: "merchant" as any }, { onConflict: "user_id,role" });

    const { error } = await supabase.from("stores").insert({
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
      status: "draft",
    });

    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Erreur", description: "Ce nom de boutique est déjà pris. Choisissez un autre nom.", variant: "destructive" });
      } else {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Boutique créée ! 🎉", description: `"${formData.name}" est prête. Ajoutez maintenant vos produits.` });
      navigate("/dashboard");
    }
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

      <main className="container mx-auto px-4 py-8 max-w-2xl">
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
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Informations de votre boutique</h2>
                <p className="text-sm text-muted-foreground">Donnez un nom et une description à votre boutique</p>
              </div>

              <div>
                <Label htmlFor="name">Nom de la boutique *</Label>
                <Input
                  id="name"
                  placeholder="Ex: AfrikaMode, TechGadgets..."
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="mt-1.5"
                  maxLength={100}
                />
                {formData.name.trim() && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Votre boutique sera accessible à : <span className="font-medium text-primary">{generateSlug(formData.name)}.shopease.com</span>
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre boutique en quelques mots..."
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="mt-1.5"
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div>
                <Label htmlFor="currency">Devise</Label>
                <Select value={formData.currency} onValueChange={(v) => updateField("currency", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 1: Logo & Customization */}
          {step === 1 && (
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
                <Textarea
                  id="terms"
                  placeholder="Vos conditions de vente, politique de retour, etc."
                  value={formData.terms_conditions}
                  onChange={(e) => updateField("terms_conditions", e.target.value)}
                  className="mt-1.5"
                  rows={4}
                  maxLength={5000}
                />
              </div>
            </div>
          )}

          {/* Step 2: Address & Contact */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Adresse & Contact</h2>
                <p className="text-sm text-muted-foreground">Ces informations seront visibles sur votre boutique</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    placeholder="Dakar"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="mt-1.5"
                    maxLength={100}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Pays</Label>
                  <Select value={formData.country} onValueChange={(v) => updateField("country", v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Adresse complète</Label>
                <Input
                  id="address"
                  placeholder="Quartier, rue, numéro..."
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="mt-1.5"
                  maxLength={255}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+221 77 000 00 00"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="mt-1.5"
                    maxLength={20}
                  />
                </div>
                <div>
                  <Label htmlFor="store-email">Email de la boutique</Label>
                  <Input
                    id="store-email"
                    type="email"
                    placeholder="contact@maboutique.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="mt-1.5"
                    maxLength={255}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
            >
              <ArrowLeft className="w-4 h-4" />
              Précédent
            </Button>

            {step < steps.length - 1 ? (
              <Button
                variant="hero"
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
              >
                Suivant
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="hero"
                onClick={handleSubmit}
                disabled={loading || !canNext()}
              >
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
