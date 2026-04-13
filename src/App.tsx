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
