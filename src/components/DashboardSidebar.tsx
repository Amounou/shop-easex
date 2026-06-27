import { useNavigate, useLocation } from "react-router-dom";
import {
  Home, ShoppingCart, Package, Users, DollarSign, BarChart3,
  Megaphone, Star, Zap, MoreHorizontal, Image, Download,
  Settings, HelpCircle, ChevronDown, LogOut, Eye,
} from "lucide-react";
import logoAsset from "@/assets/logo-shopease.png.asset.json";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/hooks/useUserStore";
import { useState } from "react";

const mainItems = [
  { title: "Accueil", url: "/dashboard", icon: Home },
  { title: "Ventes", url: "/dashboard/sales", icon: ShoppingCart },
  { title: "Produits", url: "/dashboard/products", icon: Package },
  { title: "Clients", url: "/dashboard/customers", icon: Users },
  { title: "Revenus", url: "/dashboard/revenue", icon: DollarSign },
  { title: "Analytiques", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Marketing", url: "/dashboard/marketing", icon: Megaphone },
  { title: "Avis", url: "/dashboard/reviews", icon: Star },
  { title: "Automatisations", url: "/dashboard/automations", icon: Zap },
];

const moreItems = [
  { title: "Médias", url: "/dashboard/media", icon: Image },
  { title: "Exports", url: "/dashboard/exports", icon: Download },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { store } = useUserStore();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Déconnecté", description: "À bientôt !" });
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="pt-4">
        <div className="flex items-center gap-2 px-4 mb-4">
          {store?.logo_url ? (
            <img src={store.logo_url} alt={store.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <img src={logoAsset.url} alt="ShopEase" className="w-8 h-8 rounded-lg object-contain flex-shrink-0" />
          )}
          {!collapsed && <span className="text-lg font-bold text-foreground truncate">{store?.name || "ShopEase"}</span>}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end={item.url === "/dashboard"} className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {!collapsed ? (
                <Collapsible open={moreOpen} onOpenChange={setMoreOpen}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors w-full">
                        <MoreHorizontal className="h-5 w-5 flex-shrink-0" />
                        <span className="flex-1 text-left">Plus</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>
                  <CollapsibleContent>
                    {moreItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive(item.url)}>
                          <NavLink to={item.url} className="flex items-center gap-3 px-3 py-2 pl-10 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" activeClassName="bg-primary/10 text-primary font-medium">
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                moreItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" activeClassName="bg-primary/10 text-primary font-medium">
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")}>
                  <NavLink to="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" activeClassName="bg-primary/10 text-primary font-medium">
                    <Settings className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>Paramètres</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Plus</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/help" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    <HelpCircle className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>Centre d'aide</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2">
        <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => navigate(store ? `/store/${store.slug}` : "/store")}>
          <Eye className="h-4 w-4" />
          {!collapsed && <span>Voir ma boutique</span>}
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive hover:text-destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Déconnexion</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
