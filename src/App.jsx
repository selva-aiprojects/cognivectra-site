import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
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
import AdminEnhanced from "./pages/AdminEnhanced.jsx";
import AdminReports from "./pages/AdminReports.jsx";
import Footer from "./components/Footer.jsx";
import Chatbot from "./components/Chatbot.jsx";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./index.css";

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();

  const showChatbot = true;

  return (
    <div className="appShell">
      <div className="ambient-glow" />
      <Navbar setIsChatOpen={setIsChatOpen} />

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
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
            <Route path="/admin" element={<AdminEnhanced />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </main>

      <Footer />
      {showChatbot && <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />}
    </div>
  );
}
