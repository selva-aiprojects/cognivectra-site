import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Chatbot from "./components/Chatbot.jsx";

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
import Careers from "./pages/Careers.jsx";

import chatIcon from "./assets/chat-icon.svg";
import "./index.css";

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();

  /* Optional: Auto-close chat on route change */
  useEffect(() => {
    setIsChatOpen(false);
  }, [location.pathname]);

  const showChatbot = true;

  return (
    <div className="app-layout">
      <div className="ambient-glow" />

      {/* Navbar */}
      <Navbar setIsChatOpen={setIsChatOpen} />

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
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/compensation" element={<AdminCompensation />} />
          <Route path="/admin/offers" element={<AdminOffers />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      {/* Floating Chat Icon */}
      {showChatbot && (
        <div
          className="chat-widget-icon"
          onClick={() => setIsChatOpen(true)}
          aria-label="Chat with AI Assistant"
          role="button"
        >
          <img src={chatIcon} alt="Chat" />
        </div>
      )}

      {/* Chat Panel */}
      {showChatbot && (
        <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
