import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { FaSpinner } from "react-icons/fa";
import { supabase } from "./lib/supabase";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Chatbot from "./components/Chatbot.jsx";
import CursorTrail from "./components/CursorTrail.jsx";
import DemoRequestModal from "./components/DemoRequestModal.jsx";
import NeuralSearch from "./components/NeuralSearch.jsx";

// Pages with lazy loading
const Home = lazy(() => import("./pages/Home.jsx"));
const Mission = lazy(() => import("./pages/Mission.jsx"));
const WhoWeAre = lazy(() => import("./pages/WhoWeAre.jsx"));
const Blog = lazy(() => import("./pages/Blog.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Services = lazy(() => import("./pages/Services.jsx"));
const Engagements = lazy(() => import("./pages/Engagements.jsx"));
const Results = lazy(() => import("./pages/Results.jsx"));
const Industries = lazy(() => import("./pages/Industries.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));
const AdminReports = lazy(() => import("./pages/AdminReports.jsx"));
const AdminJobs = lazy(() => import("./pages/AdminJobs.jsx"));
const AdminCompensation = lazy(() => import("./pages/AdminCompensation.jsx"));
const AdminOffers = lazy(() => import("./pages/AdminOffers.jsx"));
const AdminBlog = lazy(() => import("./pages/AdminBlog.jsx"));
const AdminClients = lazy(() => import("./pages/AdminClients.jsx"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout.jsx"));
const AdminProjects = lazy(() => import("./pages/AdminProjects.jsx"));
const AdminEnhanced = lazy(() => import("./pages/AdminEnhanced.jsx"));
const Careers = lazy(() => import("./pages/Careers.jsx"));
const Products = lazy(() => import("./pages/Products.jsx"));
const Leadership = lazy(() => import("./pages/Leadership.jsx"));
const StockStewardDetail = lazy(() => import("./pages/StockStewardDetail.jsx"));
const StoreAIDetail = lazy(() => import("./pages/StoreAIDetail.jsx"));
const MedFlowDetail = lazy(() => import("./pages/MedFlowDetail.jsx"));
const HealthezeeDetail = lazy(() => import("./pages/HealthezeeDetail.jsx"));
const EduPortalDetail = lazy(() => import("./pages/EduPortalDetail.jsx"));


import chatIcon from "./assets/chat-icon.svg";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { trackPageView } from "./lib/analytics";
import "./index.css";

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [demoPlatform, setDemoPlatform] = useState('general');
  const [theme, setTheme] = useState(localStorage.getItem('cv-theme') || 'deep-tech');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cv-theme', theme);
  }, [theme]);
  const location = useLocation();
  const navigate = useNavigate();


  /* Scroll to top/section on route change */
  useEffect(() => {
    setIsChatOpen(false);

    // Track Page View
    trackPageView(location.pathname);

    // Check for demo request in URL
    const urlParams = new URLSearchParams(location.search);
    const product = urlParams.get('product');
    if (product) {
      setDemoPlatform(product);
      setIsDemoModalOpen(true);
    }

    // Global Auth Logic: Handle Password Recovery redirections
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔔 App Auth Event:", event);
      if (event === "PASSWORD_RECOVERY") {
        console.log("🚀 Global Intercept: Password Recovery event detected via Event.");
        navigate("/reset-password");
      }
    });

    // Manual Hash Intercept (Sometimes Snappier)
    if (window.location.hash.includes('type=recovery') || window.location.hash.includes('access_token')) {
      if (location.pathname !== '/reset-password') {
        console.log("🚀 Global Intercept: Password Recovery detected via Hash.");
        navigate("/reset-password");
      }
    }

    if (location.hash) {
      const el = document.getElementById(location.hash.substring(1));
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
    return () => {
      subscription.unsubscribe();
    };
  }, [location.pathname, location.hash, location.search, navigate]);

  const showChatbot = true;

  return (
    <div className="app-layout">
      <CursorTrail />
      <div className="ambient-glow" />

      {/* Navbar - Only show on non-admin routes */}
      {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/login') && (
        <Navbar
          setIsChatOpen={setIsChatOpen}
          setIsDemoModalOpen={setIsDemoModalOpen}
          setDemoPlatform={setDemoPlatform}
          setIsSearchOpen={setIsSearchOpen}
          theme={theme}
          setTheme={setTheme}
        />
      )}

      {/* Main Content */}
      <main className={(location.pathname.startsWith('/admin') || location.pathname.startsWith('/login')) ? "admin-app-shell" : "appShell"}>
        <Suspense fallback={
          <div className="loading-container">
            <FaSpinner className="loading-spinner spin" />
            <p>Loading Platform...</p>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/who-we-are" element={<WhoWeAre />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/engagements" element={<Engagements />} />
            <Route path="/results" element={<Results />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/stocksteward" element={<StockStewardDetail />} />
            <Route path="/products/storeai" element={<StoreAIDetail />} />
            <Route path="/products/medflow" element={<MedFlowDetail />} />
            <Route path="/products/healthezee" element={<HealthezeeDetail />} />
            <Route path="/products/eduportal" element={<EduPortalDetail />} />
            <Route path="/leadership" element={<Leadership />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Admin />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="compensation" element={<AdminCompensation />} />
              <Route path="offers" element={<AdminOffers />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="omni" element={<AdminEnhanced />} />
            </Route>
            <Route path="/admin/*" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </Suspense>
      </main>

      {/* Floating Chat Icon */}


      {/* Chat Panel - Only show on non-admin routes */}
      {showChatbot && !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/login') && (
        <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      )}

      {/* Footer - Only show on non-admin routes */}
      {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/login') && (
        <Footer />
      )}

      {/* Demo Request Modal */}
      <DemoRequestModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        platform={demoPlatform}
      />

      {/* Neural Search RAG Modal */}
      <NeuralSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Analytics */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
