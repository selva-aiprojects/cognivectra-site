import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

import saas3d from "../assets/generated/ind-saas-3d.png";
import fintech3d from "../assets/generated/ind-fintech-3d.png";
import health3d from "../assets/generated/ind-health-3d.png";
import ecommerce3d from "../assets/generated/ind-ecommerce-3d.png";
import edtech3d from "../assets/generated/ind-edtech-3d.png";

import industriesHero from "../assets/generated/hero-industries-ultra-8k.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function Industries() {
  const industries = [
    {
      id: "healthcare",
      title: "Healthcare",
      description:
        "Healthcare management, hospital operations, pharmacy and digital health platforms.",
      features: [
        "EMR & clinical workflow platforms",
        "Pharmacy and hospital operations",
        "Security and regulatory compliance",
      ],
      image: health3d,
    },
    {
      id: "hr-talent",
      title: "HR & Talent",
      description:
        "HR management, workforce operations and talent management platforms.",
      features: [
        "HRMS and workforce operations",
        "Talent and performance management",
        "Workforce analytics",
      ],
      image: saas3d,
    },
    {
      id: "hospitality",
      title: "Hospitality",
      description:
        "Hospitality management and operational platforms for modern hospitality businesses.",
      features: [
        "Reservations and front office",
        "Property and guest management",
        "Operational reporting",
      ],
      image: ecommerce3d,
    },
    {
      id: "bfsi-fintech",
      title: "BFSI & FinTech",
      description:
        "Banking, financial workflows, portfolio intelligence and enterprise financial technology.",
      features: [
        "Financial and portfolio platforms",
        "Digital banking workflows",
        "Security and compliance frameworks",
      ],
      image: fintech3d,
    },
    {
      id: "retail-commerce",
      title: "Retail & Commerce",
      description:
        "Inventory, sales, purchasing and business operations for modern retail.",
      features: [
        "Inventory and order management",
        "Purchasing and sales operations",
        "Business analytics",
      ],
      image: ecommerce3d,
    },
    {
      id: "enterprise",
      title: "Enterprise Technology",
      description:
        "AI, automation, cloud modernization, platform engineering and enterprise applications.",
      features: [
        "AI and automation",
        "Cloud modernization",
        "Enterprise application engineering",
      ],
      image: edtech3d,
    },
  ];

  return (
    <main>
      <Helmet>
        <title>Industries | Cognivectra</title>
        <meta name="description" content="Cognivectra develops technology across healthcare, HR & talent, hospitality, BFSI & fintech, retail & commerce, and enterprise technology." />
        <meta property="og:title" content="Cognivectra | Industries & Solutions" />
        <meta property="og:description" content="Technology built around business context across multiple industries." />
        <meta property="og:url" content="https://cognivectra.com/industries" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-modern-inner">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-badge">Industries</span>

            <h1>
              Technology Built Around <br />
              Business Context
            </h1>

            <p>
              Cognivectra develops technology across industries where complex workflows,
              data, integration and operational reliability matter.
            </p>

            <div className="hero-cta">
              <Link to="/contact" className="btn">Talk to Cognivectra</Link>
              <Link to="/products" className="btn-outline">Explore Our Products</Link>
            </div>

            <p className="hero-subtext" style={{ marginTop: "2rem", opacity: 0.6 }}>
              Healthcare · HR & Talent · Hospitality · BFSI & FinTech · Retail · Enterprise
            </p>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="industry-visual glass-panel">
              <img src={industriesHero} alt="Cognivectra industries" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* INDUSTRIES GRID */}
      <section className="services-modern">
        <motion.div className="section-header text-center" style={{ marginBottom: '3rem' }} {...fadeInUp}>
          <span className="hero-badge">Solutions</span>
          <h3>Industry Solutions</h3>
        </motion.div>

        <div className="services-modern-grid">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.id}
              id={industry.id}
              className="service-modern-card glass-panel"
              style={{ padding: '2rem' }}
              {...fadeInUp}
              transition={{ delay: i * 0.08 }}
            >
              <div className="industry-content">
                <h4 style={{ color: 'var(--accent-light)', marginBottom: '1.5rem' }}>{industry.title}</h4>
                <p>{industry.description}</p>

                <ul className="service-highlights" style={{ margin: '1.5rem 0' }}>
                  {industry.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="industry-visual" style={{ height: '220px', marginTop: '1rem' }}>
                <img
                  src={industry.image}
                  alt={`${industry.title} 3D Visual`}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VALUE BREAK */}
      <section className="why-modern">
        <div className="why-modern-inner">
          <h3>Enterprise-Grade Delivery Across Sectors</h3>

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
          <Link to="/contact" className="btn">
            Talk to Cognivectra
          </Link>
        </div>
      </section>

    </main>
  );
}
