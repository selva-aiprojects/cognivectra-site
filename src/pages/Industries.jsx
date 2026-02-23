import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* High-quality industry visuals */
import saas3d from "../assets/generated/ind-saas-3d.png";
import fintech3d from "../assets/generated/ind-fintech-3d.png";
import health3d from "../assets/generated/ind-health-3d.png";
import ecommerce3d from "../assets/generated/ind-ecommerce-3d.png";
import edtech3d from "../assets/generated/ind-edtech-3d.png";
import logistics3d from "../assets/generated/ind-logistics-3d.png";

import industriesHero from "../assets/generated/hero-industries-ultra-8k.png";

export default function Industries() {
  const industries = [
    {
      title: "Enterprise SaaS & Platforms",
      description:
        "Scalable cloud foundations, CI/CD, observability, and platform engineering for mission-critical multi-tenant systems.",
      features: [
        "Multi-tenant architecture design",
        "Scalable data models and APIs",
        "Performance optimization and monitoring",
      ],
      image: saas3d,
    },
    {
      title: "FinTech & Regulated",
      description:
        "Secure, compliant platforms with audit trails, encryption, and governance for financial services and regulated sectors.",
      features: [
        "Security and compliance frameworks",
        "Multi-cloud and hybrid strategies",
        "Cost optimization and governance",
      ],
      image: fintech3d,
    },
    {
      title: "HealthTech & Life Sciences",
      description:
        "HIPAA-ready infrastructure, data pipelines, and AI platforms for healthcare, diagnostics, and research.",
      features: [
        "Data and integration platforms",
        "Automation across clinical workflows",
        "Security and regulatory compliance",
      ],
      image: health3d,
    },
    {
      title: "E-commerce & Retail Tech",
      description:
        "High-availability storefronts, inventory systems, and customer data platforms for modern retail.",
      features: [
        "Scalable e-commerce platforms",
        "Inventory and order management",
        "Customer analytics and personalization",
      ],
      image: ecommerce3d,
    },
    {
      title: "EdTech & Learning Platforms",
      description:
        "Scalable learning management systems, content delivery, and analytics for education and training.",
      features: [
        "Scalable content delivery",
        "User management and analytics",
        "Automation of learning workflows",
      ],
      image: edtech3d,
    },
    {
      title: "Logistics & Supply Chain",
      description:
        "Real-time tracking, optimization engines, and integration platforms for modern supply chains.",
      features: [
        "Real-time tracking systems",
        "Optimization engines",
        "Integration platforms",
      ],
      image: logistics3d,
    },
  ];


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
            <span className="hero-badge">🏭 Industry Expertise</span>

            <h1>
              Industries & <br />
              Use Cases
            </h1>

            <p>
              CogniVectra works with enterprises building AI-native and data-driven platforms,
              as well as regulated industries where reliability, security,
              and compliance are non-negotiable.
            </p>

            <div className="hero-cta">
              <button onClick={() => { }} className="btn">
                Request Demo
              </button>
              <Link to="/#services" className="btn-outline">
                View Services
              </Link>
            </div>

            <p className="hero-subtext" style={{ marginTop: "2rem", opacity: 0.6 }}>
              SaaS · FinTech · HealthTech · E-commerce · EdTech · Logistics
            </p>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="industry-visual glass-panel">
              <img src={industriesHero} alt="Industry Expertise" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* INDUSTRIES GRID */}
      <section className="services-modern">
        <h3>Industry Solutions</h3>

        <div className="services-modern-grid">

          {industries.map((industry) => (
            <div key={industry.title} className="service-modern-card glass-panel" style={{ padding: '2rem' }}>
              <div className="industry-content">
                <h4 style={{ color: 'var(--accent-light)', marginBottom: '1.5rem' }}>{industry.title}</h4>
                <p>{industry.description}</p>

                <ul className="service-highlights" style={{ margin: '1.5rem 0' }}>
                  {industry.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="industry-visual" style={{ height: '240px', marginTop: '1rem' }}>
                <img
                  src={industry.image}
                  alt={`${industry.title} 3D Visual`}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          ))}


        </div>
      </section>

      {/* VALUE BREAK */}
      <section className="why-modern">
        <div className="why-modern-inner">
          <h3>Industry-Specific Expertise</h3>

          <div className="why-modern-grid">
            <div className="why-pill">Domain-specific architecture</div>
            <div className="why-pill">Security & compliance first</div>
            <div className="why-pill">AI-native platforms</div>
            <div className="why-pill">Cloud-native foundations</div>
            <div className="why-pill">Scalable automation</div>
            <div className="why-pill">Rapid enterprise deployment</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern">
        <div className="container" style={{ textAlign: 'center' }}>
          <h3>Your Industry Not Listed?</h3>
          <p>
            Even if your domain is not listed, if you are building a
            software or data-driven product, we can help you.
          </p>
          <Link to="/#services" className="btn">
            Explore Our Expertise
          </Link>
        </div>
      </section>

    </main>
  );
}
