import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardSales from "./pages/dashboard/DashboardSales";
import DashboardProducts from "./pages/dashboard/DashboardProducts";
import DashboardCustomers from "./pages/dashboard/DashboardCustomers";
import DashboardRevenue from "./pages/dashboard/DashboardRevenue";
import DashboardAnalytics from "./pages/dashboard/DashboardAnalytics";
import DashboardMarketing from "./pages/dashboard/DashboardMarketing";
import DashboardReviews from "./pages/dashboard/DashboardReviews";
import DashboardAutomations from "./pages/dashboard/DashboardAutomations";
import DashboardMedia from "./pages/dashboard/DashboardMedia";
import DashboardExports from "./pages/dashboard/DashboardExports";
import DashboardSettings from "./pages/dashboard/DashboardSettings";
import SettingsIdentity from "./pages/dashboard/settings/Identity";
import SettingsCreatorProfile from "./pages/dashboard/settings/CreatorProfile";
import SettingsAppearance from "./pages/dashboard/settings/Appearance";
import SettingsDomain from "./pages/dashboard/settings/Domain";
import SettingsPages from "./pages/dashboard/settings/Pages";
import SettingsSeo from "./pages/dashboard/settings/Seo";
import SettingsTracking from "./pages/dashboard/settings/Tracking";
import SettingsNotifications from "./pages/dashboard/settings/Notifications";
import SettingsSupport from "./pages/dashboard/settings/Support";
import SettingsProfile from "./pages/dashboard/settings/Profile";
import SettingsTeam from "./pages/dashboard/settings/Team";
import SettingsBilling from "./pages/dashboard/settings/Billing";
import SettingsTransfers from "./pages/dashboard/settings/Transfers";
import SettingsDeleteAccount from "./pages/dashboard/settings/DeleteAccount";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import HelpCenter from "./pages/HelpCenter";
import CreateStore from "./pages/CreateStore";
import StorePage from "./pages/Store";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="sales" element={<DashboardSales />} />
              <Route path="products" element={<DashboardProducts />} />
              <Route path="customers" element={<DashboardCustomers />} />
              <Route path="revenue" element={<DashboardRevenue />} />
              <Route path="analytics" element={<DashboardAnalytics />} />
              <Route path="marketing" element={<DashboardMarketing />} />
              <Route path="reviews" element={<DashboardReviews />} />
              <Route path="automations" element={<DashboardAutomations />} />
              <Route path="media" element={<DashboardMedia />} />
              <Route path="exports" element={<DashboardExports />} />
              <Route path="settings" element={<DashboardSettings />} />
              <Route path="settings/identity" element={<SettingsIdentity />} />
              <Route path="settings/creator-profile" element={<SettingsCreatorProfile />} />
              <Route path="settings/appearance" element={<SettingsAppearance />} />
              <Route path="settings/domain" element={<SettingsDomain />} />
              <Route path="settings/pages" element={<SettingsPages />} />
              <Route path="settings/seo" element={<SettingsSeo />} />
              <Route path="settings/tracking" element={<SettingsTracking />} />
              <Route path="settings/notifications" element={<SettingsNotifications />} />
              <Route path="settings/support" element={<SettingsSupport />} />
              <Route path="settings/profile" element={<SettingsProfile />} />
              <Route path="settings/team" element={<SettingsTeam />} />
              <Route path="settings/billing" element={<SettingsBilling />} />
              <Route path="settings/transfers" element={<SettingsTransfers />} />
              <Route path="settings/delete-account" element={<SettingsDeleteAccount />} />
            </Route>
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/create-store" element={<CreateStore />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/:slug" element={<StorePage />} />
            <Route path="/store/:slug/product/:productSlug" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
