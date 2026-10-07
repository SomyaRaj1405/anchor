import React from "react";
import { Link } from "react-router-dom";

const disclaimer =
  "Anchor shows population-level evidence and modelled scenarios. It does not predict any individual's outcome.";

const provenance = {
  EMPIRICAL: "A statistic published in a cited study.",
  MODELLED: "A rule-based pattern computed from a candidate profile.",
  SIMULATED: "A scenario projection built from stated assumptions.",
};

function ProvenanceBadge({ kind }) {
  return <span className={`provenance provenance-${kind.toLowerCase()}`}>{kind}</span>;
}

function EvidenceChip({ id }) {
  return <a className="evidence-chip" href={`/evidence#${id}`}>{id}</a>;
}

function ToolCard({ to, title, children }) {
  return (
    <Link className="tool-card" to={to}>
      <h3>{title}</h3>
      <p>{children}</p>
      <span>Open tool →</span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="anchor-page">
      <section className="hero">
        <p className="eyebrow">STEADY GROUND FOR THE RETURN TO WORK</p>
        <h1>Anchor</h1>
        <p className="hero-tagline">
          Anchor checks whether qualification was ever the limiting barrier,
          before it recommends a course.
        </p>
        <div className="actions">
          <Link className="button primary" to="/diagnostic">Try the diagnostic</Link>
          <Link className="button secondary" to="/evidence">See the evidence</Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">THE PROBLEM IN NUMBERS</p>
          <h2>What the evidence says</h2>
        </div>
        <div className="number-grid">
          <article className="number-card">
            <strong>49%</strong>
            <p>lower callbacks for women with a career break (India, EV-001)</p>
            <div><ProvenanceBadge kind="EMPIRICAL" /> <EvidenceChip id="EV-001" /></div>
          </article>
          <article className="number-card">
            <strong>+15%</strong>
            <p>more callbacks when resumes show years worked instead of dates (UK, EV-002)</p>
            <div><ProvenanceBadge kind="EMPIRICAL" /> <EvidenceChip id="EV-002" /></div>
          </article>
          <article className="number-card">
            <strong>No effect</strong>
            <p>from adding upskilling certificates (EV-001)</p>
            <div><ProvenanceBadge kind="EMPIRICAL" /> <EvidenceChip id="EV-001" /></div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">HOW ANCHOR WORKS</p>
          <h2>Evidence → explanation → intervention</h2>
        </div>
        <div className="steps">
          <article><span>01</span><h3>Observe</h3><p>Evidence and ontology establish the reference layer.</p></article>
          <article><span>02</span><h3>Explain</h3><p>Barrier flags show why opportunity may be reduced.</p></article>
          <article><span>03</span><h3>Intervene</h3><p>Simulation, transition analysis and screening audit show what can change.</p></article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">FOUR TOOLS</p>
          <h2>Choose the next question</h2>
        </div>
        <div className="tool-grid">
          <ToolCard to="/diagnostic" title="Candidate Diagnostic">
            Which barriers are present, and should the candidate reframe, reskill or transition?
          </ToolCard>
          <ToolCard to="/lab" title="Intervention Lab">
            How do screening odds change when the same experience is presented differently?
          </ToolCard>
          <ToolCard to="/transition" title="Transition Intelligence">
            Which skills transfer, which are stale, and which are missing for a target role?
          </ToolCard>
          <ToolCard to="/audit" title="Employer Screening Audit">
            Which screening rules can wrongly exclude returning talent?
          </ToolCard>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">PROVENANCE</p>
          <h2>Three labels on every number</h2>
        </div>
        <div className="legend">
          {Object.entries(provenance).map(([kind, meaning]) => (
            <div className="legend-row" key={kind}>
              <ProvenanceBadge kind={kind} />
              <span>{meaning}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section limits">
        <div className="section-heading">
          <p className="eyebrow">HONEST LIMITS</p>
          <h2>What Anchor does not claim</h2>
        </div>
        <ul>
          <li>Evidence is population-level, not a prediction for an individual.</li>
          <li>The two published studies cover different countries.</li>
          <li>Scenario outputs are SIMULATED, not measured callback probabilities.</li>
          <li>The skills-and-roles ontology is an illustrative hackathon seed.</li>
        </ul>
      </section>

      <footer>{disclaimer}</footer>
    </main>
  );
}
