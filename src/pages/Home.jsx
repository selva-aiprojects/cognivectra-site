import { Link } from "react-router-dom";  // ✅ Fixed import

export default function Home() {
  return (
    <section>  {/* ✅ WRAPPER + SPACING */}
      <div className="container">
        <h2>CogniVectra Innovations & Solutions</h2>
        <p>We’re an emerging & energetic organization helping startups through focused services / programs.</p>

        <div className="grid2">
          <section className="card">
            <h3>Our mission</h3>  {/* ✅ h3 instead of h2 */}
            <p>
              <b>Clear goals, measurable impact, and community-led action.</b><br/>
              To design and deliver intelligent, adaptive, and resilient enterprise systems that help organizations operate smarter, scale faster, and evolve continuously in a changing technology landscape.
              We believe intelligence is not just about AI — it is about clarity of thinking, strength of architecture, and excellence in execution.
            </p>
            <Link to="/mission">Read more →</Link>
          </section>

          <section className="card">
            <h3>Get in touch</h3>  {/* ✅ h3 instead of h2 */}
            <p>Partner, volunteer, or ask a question—contact us anytime.</p>
            <Link to="/contact">Contact →</Link>
          </section>
        </div>
      </div>
    </section>
  );
}
