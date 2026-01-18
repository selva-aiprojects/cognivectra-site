export default function WhoWeAre() {
  return (
    <section className="section ai-neutral">
      <div className="container">
        {/* Hero Section */}
        <div
          className="card"
          style={{ maxWidth: "800px", margin: "0 auto 3rem" }}
        >
          <h2>Who We Are</h2>
          <p className="stack">
            CogniVectra Innovations is a startup-focused technology partner
            specializing in automation, cloud foundations, and SaaS building
            blocks that enable founders to move fast without compromising on
            reliability.
          </p>
          <p className="stack">
            We work at the intersection of systems engineering, data, cloud, and
            applied intelligence, helping startups modernize operations,
            streamline workflows, and build future-ready digital platforms that
            investors and customers can trust. [web:21]
          </p>
          <p className="stack">
            Our approach is pragmatic and outcome-driven: design lean, robust
            foundations, automate what slows you down, and keep your technology
            stack understandable as you scale. [web:42]
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid2">
          <section className="card">
            <h2>What We Value</h2>
            <ul className="stack">
              <li>Integrity in advice, estimates, and delivery.</li>
              <li>Consistency in architecture, operations, and support.</li>
              <li>Community ownership and knowledge sharing with your team.</li>
              <li>Outcome-driven innovation, not technology for its own sake.</li>
              <li>
                Pragmatic technology leadership that balances speed, cost, and
                risk. [web:48]
              </li>
            </ul>
          </section>

          <section className="card">
            <h2>Our Approach</h2>
            <p className="stack">
              We start with your business model, customers, and runway, then
              design automation and cloud foundations that match your current
              stage and future growth. [web:41]
            </p>
            <p className="stack">
              Every engagement blends architecture, hands-on implementation, and
              mentoring for your in-house team, so you are not locked into a
              black-box platform. [web:47]
            </p>
            <p>
              <strong>Pragmatic. Sustainable. Built for startups.</strong>
            </p>
          </section>
        </div>

        {/* What We Do - Full width card */}
        <div
          className="card"
          style={{ maxWidth: "800px", margin: "3rem auto" }}
        >
          <h2>What We Do</h2>

          <div className="service-group" style={{ marginBottom: "2rem" }}>
            <h3>Cloud & Platform Foundations</h3>
            <ul>
              <li>Design and setup of startup-ready cloud landing zones.</li>
              <li>Cloud-native and hybrid architecture for SaaS products.</li>
              <li>Multi-environment, multi-account setups with security baked in.</li>
              <li>
                Integration of data, automation, and observability into core
                platforms. [web:47]
              </li>
            </ul>
          </div>

          <div className="service-group" style={{ marginBottom: "2rem" }}>
            <h3>Intelligent Operations & Automation</h3>
            <ul>
              <li>Business and IT operations optimization for lean teams.</li>
              <li>Workflow orchestration and event-driven automation.</li>
              <li>
                No-code, low-code, and API-based automation across tools and
                teams. [web:41]
              </li>
            </ul>
          </div>

          <div className="service-group" style={{ marginBottom: "2rem" }}>
            <h3>SaaS & Applied Intelligence</h3>
            <ul>
              <li>Reusable SaaS components: auth, billing, and notifications.</li>
              <li>
                Practical AI and analytics embedded into products and operations.
              </li>
              <li>
                Human-in-the-loop patterns for safer, more reliable automation.
                [web:44]
              </li>
            </ul>
          </div>

          <div className="service-group">
            <h3>Advisory & Fractional Leadership</h3>
            <ul>
              <li>Technology strategy and runway-aware roadmaps.</li>
              <li>Architecture reviews and modernization planning.</li>
              <li>
                Fractional CTO and platform advisory for founders and boards.
                [web:46]
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
