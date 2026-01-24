import { Link } from "react-router-dom";

/* High-quality industry visuals */
import saasImage from "../assets/illustrations/industries-saas.svg";
import fintechImage from "../assets/illustrations/industries-fintech.svg";
import healthImage from "../assets/illustrations/industries-healthcare.svg";
import ecommerceImage from "../assets/illustrations/industries-ecommerce.svg";
import edtechImage from "../assets/illustrations/industries-edtech.svg";
import logisticsImage from "../assets/illustrations/industries-ecommerce.svg"; // fallback

export default function Industries() {
  const industries = [
    {
      title: "SaaS & Product Startups",
      description:
        "From MVP to scale — cloud foundations, CI/CD, observability, and platform engineering for subscription businesses.",
      features: [
        "Multi-tenant architecture design",
        "Scalable data models and APIs",
        "Performance optimization and monitoring",
      ],
      image: saasImage,
    },
    {
      title: "FinTech & Regulated Industries",
      description:
        "Secure, compliant platforms with audit trails, encryption, and governance for financial services and regulated sectors.",
      features: [
        "Security and compliance frameworks",
        "Multi-cloud and hybrid strategies",
        "Cost optimization and governance",
      ],
      image: fintechImage,
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
      image: healthImage,
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
      image: ecommerceImage,
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
      image: edtechImage,
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
      image: logisticsImage,
    },
  ];

  return (
    <main>

      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-bg-gradient"></div>

        <div className="hero-modern-inner">

          <div className="hero-copy">
            <span className="hero-badge">🏭 Industry Expertise</span>

            <h1>
              Industries & <br />
              Use Cases
            </h1>

            <p>
              CogniVectra works with SaaS, AI-native, and data-driven startups,
              as well as regulated industries where reliability, security,
              and compliance matter.
            </p>

            <div className="hero-cta">
              <Link to="/contact" className="btn">
                Book Strategy Call
              </Link>
              <Link to="/services" className="btn-outline">
                View Services
              </Link>
            </div>

            <p className="hero-subtext">
              SaaS · FinTech · HealthTech · E-commerce · EdTech · Logistics
            </p>
          </div>

          {/* Visual Summary Card */}
          <div className="hero-visual">
            <img
              src="/hero_tech_services.png"
              alt="Industry-Specific Tech Solutions"
              className="hero-image-modern"
            />
          </div>

        </div>
      </section>

      {/* INDUSTRIES GRID */}
      <section className="services-modern">
        <h3>Industry Solutions</h3>

        <div className="services-modern-grid">

          {industries.map((industry) => (
            <div key={industry.title} className="service-modern-card">

              <div className="industry-header">
                <img
                  src={industry.image}
                  alt={industry.title}
                  className="industry-icon"
                />
                <h4>{industry.title}</h4>
              </div>

              <p>{industry.description}</p>

              <ul>
                {industry.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <div className="industry-visual">
                <img
                  src={industry.image}
                  alt={`${industry.title} illustration`}
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
            <div className="why-pill">Startup-speed execution</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern">
        <h3>Your Industry Not Listed?</h3>
        <p>
          Even if your domain is not listed, if you are building a
          software or data-driven product, we can help you.
        </p>
        <Link to="/contact" className="btn">
          Discuss Your Industry
        </Link>
      </section>

    </main>
  );
}
