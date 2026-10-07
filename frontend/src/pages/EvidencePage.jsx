import React, { useEffect, useState } from "react";
import { getEvidence } from "../api/client";

const disclaimer =
  "Anchor shows population-level evidence and modelled scenarios. It does not predict any individual's outcome.";

function ProvenanceBadge({ kind }) {
  return <span className={`provenance provenance-${kind.toLowerCase()}`}>{kind}</span>;
}

function Loader() {
  return <div className="state-card" role="status">Loading evidence…</div>;
}

function ErrorBanner({ error }) {
  return (
    <div className="state-card error" role="alert">
      <strong>Could not load the evidence registry.</strong>
      <p>{error?.message || "Please try again."}</p>
    </div>
  );
}

function EvidenceCard({ entry }) {
  return (
    <article className="evidence-card" id={entry.id}>
      <header>
        <div>
          <p className="eyebrow">{entry.id}</p>
          <h2>{entry.short_title}</h2>
        </div>
        <ProvenanceBadge kind={entry.provenance} />
      </header>

      <div className="headline">
        <strong>{entry.headline.value}</strong>
        <span>{entry.headline.label}</span>
      </div>

      <dl className="facts">
        <div><dt>Study type</dt><dd>{entry.study_type}</dd></div>
        <div><dt>Geography</dt><dd>{entry.geography}</dd></div>
        <div><dt>Sample</dt><dd>{entry.sample}</dd></div>
        <div><dt>Venue</dt><dd>{entry.venue}</dd></div>
        <div><dt>Year</dt><dd>{entry.year}</dd></div>
      </dl>

      <p className="citation">{entry.citation}</p>
      <p><a href={entry.url} target="_blank" rel="noreferrer">Read the study ↗</a></p>

      <section>
        <h3>What the study found</h3>
        <ul>{entry.findings.map((item, index) => <li key={index}>{item}</li>)}</ul>
      </section>

      <section className="limits">
        <h3>Limits</h3>
        <ul>{entry.limits.map((item, index) => <li key={index}>{item}</li>)}</ul>
      </section>

      <aside className="transferability">
        <strong>Transferability</strong>
        <p>{entry.transferability_note}</p>
      </aside>
    </article>
  );
}

export default function EvidencePage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    getEvidence()
      .then((data) => {
        if (active) setEntries(data?.entries || []);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loading && window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading]);

  return (
    <main className="anchor-page">
      <header className="page-header">
        <p className="eyebrow">EVIDENCE REGISTRY</p>
        <h1>Evidence behind Anchor</h1>
        <p>
          Every published statistic is labelled EMPIRICAL. MODELLED describes
          rule-based patterns, while SIMULATED describes scenario projections
          built from stated assumptions.
        </p>
      </header>

      {loading && <Loader />}
      {!loading && error && <ErrorBanner error={error} />}
      {!loading && !error && entries.length === 0 && (
        <div className="state-card">No evidence entries are available.</div>
      )}

      {!loading && !error && entries.map((entry) => (
        <EvidenceCard key={entry.id} entry={entry} />
      ))}

      <footer>{disclaimer}</footer>
    </main>
  );
}
