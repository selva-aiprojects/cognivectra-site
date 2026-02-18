import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Chatbot from "./components/Chatbot.jsx";
import CursorTrail from "./components/CursorTrail.jsx";
import DemoRequestModal from "./components/DemoRequestModal.jsx";

import Home from "./pages/Home.jsx";
import Mission from "./pages/Mission.jsx";
import WhoWeAre from "./pages/WhoWeAre.jsx";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Services from "./pages/Services.jsx";
import Engagements from "./pages/Engagements.jsx";
import Results from "./pages/Results.jsx";
import Industries from "./pages/Industries.jsx";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";
import AdminReports from "./pages/AdminReports.jsx";
import AdminJobs from "./pages/AdminJobs.jsx";
import AdminCompensation from "./pages/AdminCompensation.jsx";
import AdminOffers from "./pages/AdminOffers.jsx";
import AdminBlog from "./pages/AdminBlog.jsx";
import AdminClients from "./pages/AdminClients.jsx";
import AdminProjects from "./pages/AdminProjects.jsx";
import AdminEnhanced from "./pages/AdminEnhanced.jsx";
import Careers from "./pages/Careers.jsx";
import Products from "./pages/Products.jsx";
import Leadership from "./pages/Leadership.jsx";
import StockStewardDetail from "./pages/StockStewardDetail.jsx";
import StoreAIDetail from "./pages/StoreAIDetail.jsx";
import MedFlowDetail from "./pages/MedFlowDetail.jsx";


import chatIcon from "./assets/chat-icon.svg";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { trackPageView } from "./lib/analytics";
import "./index.css";

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoPlatform, setDemoPlatform] = useState('general');
  const location = useLocation();

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
  }, [location.pathname, location.hash, location.search]);

  const showChatbot = true;

  return (
    <div className="app-layout">
      <CursorTrail />
      <div className="ambient-glow" />

      {/* Navbar - Only show on non-admin routes */}
      {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/login') && (
        <Navbar setIsChatOpen={setIsChatOpen} setIsDemoModalOpen={setIsDemoModalOpen} setDemoPlatform={setDemoPlatform} />
      )}

      {/* Main Content */}
      <main className="appShell">
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
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/compensation" element={<AdminCompensation />} />
          <Route path="/admin/offers" element={<AdminOffers />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/omni" element={<AdminEnhanced />} />
          <Route path="/login" element={<Login />} />
        </Routes>
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

      {/* Analytics */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
