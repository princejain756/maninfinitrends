import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { OrganizationJsonLd, WebSiteJsonLd } from "./components/Seo/Organization";

// Lazy load non-critical routes for faster initial page load
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ChatWidget = lazy(() => import("./components/Chat/ChatWidget"));
const FomoPopups = lazy(() => import("./components/Marketing/FomoPopups"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Track = lazy(() => import("./pages/Track"));
const SizeGuide = lazy(() => import("./pages/SizeGuide"));
const Care = lazy(() => import("./pages/Care"));
const Bulk = lazy(() => import("./pages/Bulk"));
const Partner = lazy(() => import("./pages/Partner"));
const Repairs = lazy(() => import("./pages/Repairs"));
const ShippingReturns = lazy(() => import("./pages/Policies/ShippingReturns"));
const Privacy = lazy(() => import("./pages/Policies/Privacy"));
const Terms = lazy(() => import("./pages/Policies/Terms"));
const Refunds = lazy(() => import("./pages/Policies/Refunds"));
const Cookies = lazy(() => import("./pages/Policies/Cookies"));
const Collection = lazy(() => import("./pages/Collections/Collection"));
const CategoryRedirect = lazy(() => import("./pages/Redirects/CategoryRedirect"));
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Bamboo = lazy(() => import("./pages/Eco/Bamboo"));
const CoffeeHusk = lazy(() => import("./pages/Eco/CoffeeHusk"));
const RiceHusk = lazy(() => import("./pages/Eco/RiceHusk"));
const AdminLogin = lazy(() => import("./pages/Admin/Login"));
const AddProduct = lazy(() => import("./pages/Admin/AddProduct"));
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const AdminProductsList = lazy(() => import("./pages/Admin/Products/List"));
const AdminProductEdit = lazy(() => import("./pages/Admin/Products/Edit"));
const AdminOrdersList = lazy(() => import("./pages/Admin/Orders/List"));
const AdminOrderDetail = lazy(() => import("./pages/Admin/Orders/Detail"));
const AdminTicketsList = lazy(() => import("./pages/Admin/Tickets/List"));
const AccountLogin = lazy(() => import("./pages/Account/Login"));
const AccountRegister = lazy(() => import("./pages/Account/Register"));
const AccountOrders = lazy(() => import("./pages/Account/Orders"));
const AccountIndex = lazy(() => import("./pages/Account/Index"));
const AccountAddresses = lazy(() => import("./pages/Account/Addresses"));
const AccountForgot = lazy(() => import("./pages/Account/Forgot"));
const AccountReset = lazy(() => import("./pages/Account/Reset"));
const AccountOrderDetail = lazy(() => import("./pages/Account/OrderDetail"));
const Wishlist = lazy(() => import("./pages/Wishlist"));

// Minimal loading spinner for lazy components
const LazyFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      gcTime: 300000, // 5 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Suspense fallback={<LazyFallback />}><Shop /></Suspense>} />
          <Route path="/shop/:category" element={<Suspense fallback={<LazyFallback />}><Shop /></Suspense>} />
          <Route path="/product/:handle" element={<Suspense fallback={<LazyFallback />}><ProductDetail /></Suspense>} />
          <Route path="/cart" element={<Suspense fallback={<LazyFallback />}><Cart /></Suspense>} />
          <Route path="/wishlist" element={<Suspense fallback={<LazyFallback />}><Wishlist /></Suspense>} />
          <Route path="/checkout" element={<Suspense fallback={<LazyFallback />}><Checkout /></Suspense>} />
          {/* Marketing & Support */}
          <Route path="/about" element={<Suspense fallback={<LazyFallback />}><About /></Suspense>} />
          <Route path="/contact" element={<Suspense fallback={<LazyFallback />}><Contact /></Suspense>} />
          <Route path="/track" element={<Suspense fallback={<LazyFallback />}><Track /></Suspense>} />
          <Route path="/size-guide" element={<Suspense fallback={<LazyFallback />}><SizeGuide /></Suspense>} />
          <Route path="/care" element={<Suspense fallback={<LazyFallback />}><Care /></Suspense>} />
          <Route path="/bulk" element={<Suspense fallback={<LazyFallback />}><Bulk /></Suspense>} />
          <Route path="/partner" element={<Suspense fallback={<LazyFallback />}><Partner /></Suspense>} />
          <Route path="/services" element={<Suspense fallback={<LazyFallback />}><Repairs /></Suspense>} />
          {/* Backward compatibility */}
          <Route path="/repairs" element={<Suspense fallback={<LazyFallback />}><CategoryRedirect to="/services" /></Suspense>} />
          {/* Policies */}
          <Route path="/shipping-returns" element={<Suspense fallback={<LazyFallback />}><ShippingReturns /></Suspense>} />
          <Route path="/privacy" element={<Suspense fallback={<LazyFallback />}><Privacy /></Suspense>} />
          <Route path="/terms" element={<Suspense fallback={<LazyFallback />}><Terms /></Suspense>} />
          <Route path="/refunds" element={<Suspense fallback={<LazyFallback />}><Refunds /></Suspense>} />
          <Route path="/cookies" element={<Suspense fallback={<LazyFallback />}><Cookies /></Suspense>} />
          {/* Collections and Redirect helpers */}
          <Route path="/collections/:handle" element={<Suspense fallback={<LazyFallback />}><Collection /></Suspense>} />
          {/* Lightweight eco material landers (minimal UI) */}
          <Route path="/eco/bamboo" element={<Suspense fallback={<LazyFallback />}><Bamboo /></Suspense>} />
          <Route path="/eco/coffee-husk" element={<Suspense fallback={<LazyFallback />}><CoffeeHusk /></Suspense>} />
          <Route path="/eco/rice-husk" element={<Suspense fallback={<LazyFallback />}><RiceHusk /></Suspense>} />
          {/* Admin */}
          <Route path="/admin/login" element={<Suspense fallback={<LazyFallback />}><AdminLogin /></Suspense>} />
          <Route path="/admin" element={<Suspense fallback={<LazyFallback />}><AdminLayout /></Suspense>}>
            <Route index element={<Suspense fallback={<LazyFallback />}><AdminDashboard /></Suspense>} />
            <Route path="products" element={<Suspense fallback={<LazyFallback />}><AdminProductsList /></Suspense>} />
            <Route path="products/new" element={<Suspense fallback={<LazyFallback />}><AddProduct /></Suspense>} />
            <Route path="products/:id/edit" element={<Suspense fallback={<LazyFallback />}><AdminProductEdit /></Suspense>} />
            <Route path="orders" element={<Suspense fallback={<LazyFallback />}><AdminOrdersList /></Suspense>} />
            <Route path="orders/:id" element={<Suspense fallback={<LazyFallback />}><AdminOrderDetail /></Suspense>} />
            <Route path="tickets" element={<Suspense fallback={<LazyFallback />}><AdminTicketsList /></Suspense>} />
          </Route>
          {/* Account */}
          <Route path="/account" element={<Suspense fallback={<LazyFallback />}><AccountIndex /></Suspense>} />
          <Route path="/account/login" element={<Suspense fallback={<LazyFallback />}><AccountLogin /></Suspense>} />
          <Route path="/account/register" element={<Suspense fallback={<LazyFallback />}><AccountRegister /></Suspense>} />
          <Route path="/account/forgot" element={<Suspense fallback={<LazyFallback />}><AccountForgot /></Suspense>} />
          <Route path="/account/reset" element={<Suspense fallback={<LazyFallback />}><AccountReset /></Suspense>} />
          <Route path="/account/orders" element={<Suspense fallback={<LazyFallback />}><AccountOrders /></Suspense>} />
          <Route path="/account/orders/:id" element={<Suspense fallback={<LazyFallback />}><AccountOrderDetail /></Suspense>} />
          <Route path="/account/addresses" element={<Suspense fallback={<LazyFallback />}><AccountAddresses /></Suspense>} />
          {/* Friendly routes */}
          <Route path="/eco-collection" element={<Suspense fallback={<LazyFallback />}><CategoryRedirect to="/collections/eco-collection" /></Suspense>} />
          <Route path="/jewellery" element={<Suspense fallback={<LazyFallback />}><CategoryRedirect to="/shop/jewellery" /></Suspense>} />
          <Route path="/blog" element={<Suspense fallback={<LazyFallback />}><Blog /></Suspense>} />
          <Route path="/blog/:id" element={<Suspense fallback={<LazyFallback />}><BlogPost /></Suspense>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* Global JSON-LD */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <Suspense fallback={null}>
          <ChatWidget />
          <FomoPopups />
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
