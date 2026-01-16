export default function Mission() {
  return (
    <section className="section ai-neutral">
      <div className="container">
        {/* Hero Section */}
        <div className="card" style={{maxWidth: '800px', margin: '0 auto 3rem'}}>
          <h2>Our Mission</h2>
          <p className="stack">
            To design and deliver intelligent, adaptive, and resilient enterprise systems that help organizations 
            operate smarter, scale faster, and evolve continuously in a changing technology landscape.
          </p>
          <p className="stack">
            We believe intelligence is not just about AI — it is about clarity of thinking, strength of architecture, 
            and excellence in execution.
          </p>
        </div>

        {/* Principles Section */}
        <div className="card" style={{maxWidth: '800px', margin: '0 auto'}}>
          <h2>Guiding Principles</h2>
          <ul className="stack" style={{paddingLeft: '1.5rem'}}>
            <li>Operate transparently with clear outcomes</li>
            <li>Build partnerships with stakeholders</li>
            <li>Technology is a means, not the goal</li>
            <li>Systems outlast tools</li>
            <li>Simplicity scales better than complexity</li>
            <li>Enterprise success depends on reliability, not just innovation</li>
            <li>We focus on building solutions that remain relevant, maintainable, and valuable over decades</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
