import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { OrganizationJsonLd, WebSiteJsonLd } from "./components/Seo/Organization";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ChatWidget from "./components/Chat/ChatWidget";
import ExitIntent from "./components/Marketing/ExitIntent";
import FomoPopups from "./components/Marketing/FomoPopups";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Track from "./pages/Track";
import SizeGuide from "./pages/SizeGuide";
import Care from "./pages/Care";
import Bulk from "./pages/Bulk";
import Partner from "./pages/Partner";
import Repairs from "./pages/Repairs";
import ShippingReturns from "./pages/Policies/ShippingReturns";
import Privacy from "./pages/Policies/Privacy";
import Terms from "./pages/Policies/Terms";
import Refunds from "./pages/Policies/Refunds";
import Cookies from "./pages/Policies/Cookies";
import Collection from "./pages/Collections/Collection";
import CategoryRedirect from "./pages/Redirects/CategoryRedirect";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Bamboo from "./pages/Eco/Bamboo";
import CoffeeHusk from "./pages/Eco/CoffeeHusk";
import RiceHusk from "./pages/Eco/RiceHusk";
import AdminLogin from "./pages/Admin/Login";
import AddProduct from "./pages/Admin/AddProduct";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/product/:handle" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* Marketing & Support */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/track" element={<Track />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/care" element={<Care />} />
          <Route path="/bulk" element={<Bulk />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/services" element={<Repairs />} />
          {/* Backward compatibility */}
          <Route path="/repairs" element={<CategoryRedirect to="/services" />} />
          {/* Policies */}
          <Route path="/shipping-returns" element={<ShippingReturns />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refunds" element={<Refunds />} />
          <Route path="/cookies" element={<Cookies />} />
          {/* Collections and Redirect helpers */}
          <Route path="/collections/:handle" element={<Collection />} />
          {/* Lightweight eco material landers (minimal UI) */}
          <Route path="/eco/bamboo" element={<Bamboo />} />
          <Route path="/eco/coffee-husk" element={<CoffeeHusk />} />
          <Route path="/eco/rice-husk" element={<RiceHusk />} />
          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/products/new" element={<AddProduct />} />
          {/* Friendly routes */}
          <Route path="/eco-collection" element={<CategoryRedirect to="/collections/eco-collection" />} />
          <Route path="/jewellery" element={<CategoryRedirect to="/shop/jewellery" />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* Global JSON-LD */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <ChatWidget />
        <ExitIntent />
        <FomoPopups />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
