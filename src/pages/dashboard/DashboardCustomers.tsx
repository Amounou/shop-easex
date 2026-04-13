import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Customer {
  customer_id: string | null;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_city: string | null;
  total_orders: number;
  total_spent: number;
}

const DashboardCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: stores } = await supabase.from("stores").select("id").limit(1);
      if (!stores?.length) { setLoading(false); return; }
      const { data: orders } = await supabase
        .from("orders")
        .select("customer_id, shipping_name, shipping_phone, shipping_city, total")
        .eq("store_id", stores[0].id);

      if (!orders) { setLoading(false); return; }

      const map = new Map<string, Customer>();
      orders.forEach((o) => {
        const key = o.customer_id || o.shipping_phone || o.shipping_name || "anon";
        const existing = map.get(key);
        if (existing) {
          existing.total_orders++;
          existing.total_spent += o.total;
        } else {
          map.set(key, {
            customer_id: o.customer_id,
            shipping_name: o.shipping_name,
            shipping_phone: o.shipping_phone,
            shipping_city: o.shipping_city,
            total_orders: 1,
            total_spent: o.total,
          });
        }
      });
      setCustomers(Array.from(map.values()));
      setLoading(false);
    };
    load();
  }, []);

  const formatPrice = (p: number) => new Intl.NumberFormat("fr-FR").format(p) + " FCFA";
  const filtered = customers.filter((c) =>
    c.shipping_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.shipping_phone?.includes(search)
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-1">Clients</h1>
      <p className="text-muted-foreground mb-6">{customers.length} client(s)</p>

      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun client pour le moment</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Nom</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Téléphone</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Ville</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Commandes</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Total dépensé</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="p-4 font-medium text-foreground">{c.shipping_name || "—"}</td>
                  <td className="p-4 text-muted-foreground">{c.shipping_phone || "—"}</td>
                  <td className="p-4 text-muted-foreground">{c.shipping_city || "—"}</td>
                  <td className="p-4 text-foreground">{c.total_orders}</td>
                  <td className="p-4 font-semibold text-foreground">{formatPrice(c.total_spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardCustomers;
