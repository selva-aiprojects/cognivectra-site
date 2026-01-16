export default function About() {
  return (
    <section className="section ai-neutral">
      <div className="container">
        {/* Hero - FULL WHITE BACKGROUND */}
        <div className="card" style={{ 
          background: 'rgba(255, 255, 255, 0.97) !important',
          backdropFilter: 'blur(16px)',
          maxWidth: '900px', 
          margin: '0 auto 4rem',
          color: '#0f172a !important',
          padding: '2.5rem'
        }}>
          <h2>About CogniVectra</h2>
          <p style={{color: '#0f172a', lineHeight: '1.75'}}>
            CogniVectra is a technology innovation and consulting firm focused on helping enterprises 
            design, build, and scale intelligent digital platforms.
          </p>
          <p style={{color: '#0f172a', lineHeight: '1.75'}}>
            We specialize in <strong>AI, Data Engineering, Cloud Platforms, and GenAI-powered solutions</strong>, 
            enabling organizations to modernize legacy systems, unlock data-driven insights, and accelerate business outcomes.
          </p>
          <p style={{color: '#0f172a', lineHeight: '1.75'}}>
            At CogniVectra, we combine deep engineering expertise, industry-aligned architectures, 
            and pragmatic execution to deliver solutions that are <strong>secure, scalable, and future-ready</strong>.
          </p>
        </div>

        <div className="grid2">
          {/* Expertise */}
          <div className="card" style={{ 
            background: 'rgba(255, 255, 255, 0.97) !important',
            color: '#0f172a !important'
          }}>
            <h3>Our Expertise</h3>
            <p style={{color: '#0f172a'}}>
              Our approach bridges strategy and execution—from platform architecture and implementation 
              to optimization and go-to-market enablement—ensuring <strong>measurable impact</strong> for our clients.
            </p>
            
            <div style={{marginTop: '1.5rem'}}>
              <h4 style={{color: '#1e40af', marginBottom: '1rem'}}>What we do best:</h4>
              <ul style={{color: '#0f172a'}}>
                <li>Architect and implement AI & Data platforms</li>
                <li>Build GenAI and Agentic AI solutions</li>
                <li>Modernize cloud and enterprise systems</li>
                <li>Enable scalable digital and analytics ecosystems</li>
              </ul>
            </div>
          </div>

          {/* Industries */}
          <div className="card" style={{ 
            background: 'rgba(255, 255, 255, 0.97) !important',
            color: '#0f172a !important'
          }}>
            <h3>Our Industries</h3>
            <p style={{color: '#0f172a'}}>
              CogniVectra partners with organizations across <strong>Healthcare, BFSI, Insurance, and Enterprise domains</strong> 
              to transform complexity into competitive advantage.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="card" style={{ 
          background: 'rgba(255, 255, 255, 0.97) !important',
          maxWidth: '700px', 
          margin: '4rem auto 0', 
          textAlign: 'center',
          color: '#0f172a !important'
        }}>
          <h3 style={{color: '#0f172a'}}>Ready to Transform?</h3>
          <p style={{color: '#334155', fontSize: '1.1rem', marginBottom: '2rem'}}>
            Partner with us to build intelligent platforms that drive your business forward.
          </p>
          <a href="/contact" 
             style={{
               display: 'inline-block',
               background: 'linear-gradient(135deg, #1e40af, #6366f1)',
               color: 'white',
               padding: '1rem 2.5rem',
               borderRadius: '14px',
               textDecoration: 'none',
               fontWeight: '600',
               fontSize: '0.95rem',
               letterSpacing: '0.05em',
               textTransform: 'uppercase',
               boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
             }}
          >
            Get In Touch →
          </a>
        </div>
      </div>
    </section>
  );
}
