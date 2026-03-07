import { Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  LuUsers,
  LuGem,
  LuTarget,
  LuArrowRight,
  LuCircleCheck
} from "react-icons/lu";

/* High-resolution 3D illustrations */
import cloudImage from "../assets/generated/cap-cloud-3d-8k.png";
import automationImage from "../assets/generated/cap-ops-3d-8k.png";
import aiImage from "../assets/generated/cap-ai-3d-8k.png";
import advisoryImage from "../assets/generated/cap-advisory-3d-8k.png";

import missionHero from "../assets/generated/hero-whoweare-ultra-8k.png";
import engagementHero from "../assets/hero-engagement-ultra.png";

export default function WhoWeAre() {
  return (
    <main>

      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-modern-inner">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-badge"><LuUsers style={{ marginRight: '0.4rem' }} /> About CogniVectra</span>

            <h1>
              Enterprise Platform <br />
              Engineering Partners
            </h1>

            <p>
              CogniVectra Innovations is an enterprise AI and healthcare platform
              engineering partner specializing in production-ready systems,
              multi-tenant foundations, and GenAI building blocks that enable
              organizations to deploy at scale without compromising reliability.
            </p>

            <p style={{ margin: "0 auto 3rem", opacity: 0.8 }}>
              We operate at the intersection of systems engineering, cloud,
              data, and applied intelligence — helping enterprises modernize
              operations and build digital platforms that drive production-ready results.
            </p>

            <div className="hero-cta">
              <Link to="/contact" className="btn">
                Talk to Us
              </Link>
              <Link to="/#services" className="btn-outline">
                View Services
              </Link>
            </div>

            <p className="hero-subtext" style={{ marginTop: "2rem", opacity: 0.6 }}>
              Pragmatic · Sustainable · Enterprise-Ready
            </p>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="industry-visual glass-panel">
              <img src={missionHero} alt="Enterprise Platform Engineering Partners" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* VALUES + APPROACH */}
      <section className="services-modern">
        <div className="grid-pattern"></div>
        <h3>What Guides Our Work</h3>

        <div className="services-modern-grid">

          <div className="service-modern-card">
            <h4><LuGem style={{ marginRight: '0.6rem', color: 'var(--accent-light)' }} /> What We Value</h4>
            <ul className="service-highlights">
              <li><LuCircleCheck /> Integrity in advice, estimates, and delivery</li>
              <li><LuCircleCheck /> Consistency in architecture and operations</li>
              <li><LuCircleCheck /> Community ownership and knowledge sharing</li>
              <li><LuCircleCheck /> Outcome-driven innovation, not hype</li>
              <li><LuCircleCheck /> Pragmatic leadership balancing speed and risk</li>
            </ul>
          </div>

          <div className="service-modern-card">
            <h4><LuTarget style={{ marginRight: '0.6rem', color: 'var(--accent-light)' }} /> Our Approach</h4>
            <p>
              We start with your enterprise architecture and business goals — then
              design automation and cloud foundations that match your scale
              and future growth.
            </p>
            <p>
              Every engagement blends architecture, implementation,
              and mentoring, so you are never locked into a black-box platform.
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/leadership" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Meet Our Leadership →
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* OFFERINGS */}
      <section className="services-modern" style={{ background: 'rgba(5,7,12,0.6)' }}>
        <h3>Capabilities</h3>

        <div className="services-modern-grid">

          <div className="service-modern-card">
            <div className="industry-header">
              <img src={cloudImage} alt="Cloud foundations" className="industry-icon" />
              <h4>Cloud & Platform Foundations</h4>
            </div>
            <ul>
              <li>Enterprise-grade cloud landing zones</li>
              <li>Cloud-native and hybrid SaaS architecture</li>
              <li>Multi-environment setups with security</li>
              <li>Data and observability integration</li>
            </ul>
            <div className="industry-visual" style={{ marginTop: '1.5rem' }}>
              <img
                src={cloudImage}
                alt="Cloud foundations"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>

          <div className="service-modern-card">
            <div className="industry-header">
              <img src={automationImage} alt="Automation" className="industry-icon" />
              <h4>Intelligent Operations</h4>
            </div>
            <ul>
              <li>Lean operations optimization</li>
              <li>Workflow orchestration</li>
              <li>API-based automation engines</li>
            </ul>
            <div className="industry-visual" style={{ marginTop: '1.5rem' }}>
              <img
                src={automationImage}
                alt="Intelligent Operations"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>

          <div className="service-modern-card">
            <div className="industry-header">
              <img src={aiImage} alt="Applied AI" className="industry-icon" />
              <h4>SaaS & Applied AI</h4>
            </div>
            <ul>
              <li>Reusable SaaS components</li>
              <li>Practical AI integration</li>
              <li>Human-in-the-loop patterns</li>
            </ul>
            <div className="industry-visual" style={{ marginTop: '1.5rem' }}>
              <img
                src={aiImage}
                alt="Applied AI"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>

          <div className="service-modern-card">
            <div className="industry-header">
              <img src={advisoryImage} alt="Advisory" className="industry-icon" />
              <h4>Strategic Advisory & Architecture</h4>
            </div>
            <ul>
              <li>Technology roadmap planning</li>
              <li>Architecture reviews</li>
              <li>Strategic technology leadership</li>
            </ul>
            <div className="industry-visual" style={{ marginTop: '1.5rem' }}>
              <img
                src={advisoryImage}
                alt="Fractional CTO & Advisory"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern">
        <div className="container" style={{ textAlign: 'center' }}>
          <h3>Build Your Platform with Confidence</h3>
          <p>
            Whether you are launching, scaling, or modernizing,
            we help you build technology foundations that last.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <Link to="/contact" className="btn">
              Connect with an Architect
            </Link>
            <Link to="/careers" className="btn-outline">
              Join Our Team
            </Link>
          </div>
        </div>
      </section>

    </main >
  );
}
