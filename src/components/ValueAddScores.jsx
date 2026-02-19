import { buildValueAddedOutputs } from '../utils/buildValueAddedOutputs';

const confidenceToNumber = {
  High: 86,
  Medium: 62,
  Low: 38,
};

const featureTemplates = {
  'Functional Substitution Engine': {
    why: 'This can quickly unlock alternate parts while controlling technical and safety constraints.',
    steps: [
      'Draft a controlled alternate list with hard no-go constraints.',
      'Pilot one substitution on a non-critical asset.',
      'Freeze approved substitutions in the material master.',
    ],
    risk: 'Do not release substitutions if critical-spec deltas remain unresolved.',
  },
  'Over-Specification Detection': {
    why: 'This identifies overspend where performance margin is above actual operating need.',
    steps: [
      'Compare duty envelope to current spec margin.',
      'Propose one lower-cost compliant spec candidate.',
      'Validate reliability baseline before broad rollout.',
    ],
    risk: 'Avoid downgrades for safety-critical or unknown service conditions.',
  },
  'Application-Based Intelligence': {
    why: 'Context-specific recommendations reduce mismatch between catalog specs and field conditions.',
    steps: [
      'Capture operating context (media, duty cycle, environment).',
      'Validate candidate fit against actual use-case limits.',
      'Record approved application boundaries in notes.',
    ],
    risk: 'Missing context can create false-positive equivalence.',
  },
  'Standards & Compliance Normalizer': {
    why: 'Standard alignment reduces audit risk and avoids non-compliant substitutions.',
    steps: [
      'Verify standard/cert mappings side-by-side.',
      'Collect evidence files for compliance traceability.',
      'Route approval through compliance owner before merge.',
    ],
    risk: 'Standard mismatch can trigger legal/regulatory exposure.',
  },
  'Unit & Format Harmonization': {
    why: 'Clean units and formats reduce ordering, receiving, and installation errors.',
    steps: [
      'Normalize size/units naming in both records.',
      'Apply deterministic naming conventions in master data.',
      'Run duplicate scan after harmonization.',
    ],
    risk: 'Incorrect unit conversion can propagate wrong purchases.',
  },
  'Manufacturer & Part Number Enrichment': {
    why: 'Cross-reference clarity improves sourcing speed and alternate approval quality.',
    steps: [
      'Attach manufacturer PN and approved cross-reference.',
      'Link latest datasheets to each approved alternate.',
      'Tag sourcing status for planner visibility.',
    ],
    risk: 'Unverified cross-references can introduce counterfeit/fit risk.',
  },
  'Interchangeability / Fit Check': {
    why: 'Early fit checks reduce rework, failed installs, and downtime during swaps.',
    steps: [
      'Verify interface geometry and envelope dimensions.',
      'Confirm installation torque/alignment requirements.',
      'Run one physical fit trial before broad issue.',
    ],
    risk: 'A near-match dimension can still fail in assembly.',
  },
  'Risk Scoring for Wrong Merge': {
    why: 'Governance scoring prevents high-risk merges from bypassing review gates.',
    steps: [
      'Set merge thresholds by safety/compliance criticality.',
      'Require dual sign-off for high-risk cases.',
      'Store merge rationale in change history.',
    ],
    risk: 'Auto-merge on low-quality data can create systemic errors.',
  },
  'Maintenance & Repair Guidance': {
    why: 'Maintenance-focused guidance improves spares planning and uptime reliability.',
    steps: [
      'Map spare strategy for both compared options.',
      'Adjust PM tasks where service behavior differs.',
      'Track early-life failures post-change.',
    ],
    risk: 'Ignoring maintenance differences can shorten service life.',
  },
  'TCO Hints': {
    why: 'Lifecycle cost focus captures downtime, energy, and replacement effects beyond unit price.',
    steps: [
      'Estimate lifecycle cost drivers for both options.',
      'Quantify downtime and maintenance frequency impact.',
      'Choose candidate with best total-cost profile.',
    ],
    risk: 'Lowest purchase price may still be highest long-run cost.',
  },
  'Preferred Vendor / Availability Hint': {
    why: 'Availability strategy lowers disruption risk from lead-time shocks.',
    steps: [
      'Classify supplier risk and lead-time exposure.',
      'Define dual-source route for critical items.',
      'Set targeted safety-stock for constrained parts.',
    ],
    risk: 'Single-source dependency can halt operations.',
  },
  'BOM Impact Preview': {
    why: 'Where-used visibility avoids hidden breakage when standardizing parts across assets/sites.',
    steps: [
      'Review where-used impact by asset hierarchy.',
      'Stage rollout by low-risk BOM clusters first.',
      'Issue controlled engineering change notice.',
    ],
    risk: 'Unreviewed BOM propagation can trigger widespread rework.',
  },
  'Data Quality Checklist & Autofix': {
    why: 'Data completeness improves confidence in every downstream engineering and procurement decision.',
    steps: [
      'Fill mandatory fields and normalize naming rules.',
      'Run deterministic autofix for obvious formatting issues.',
      'Recompute match scores after cleanup.',
    ],
    risk: 'Poor master data reduces trust in all recommendations.',
  },
};

const gaugeClass = (score) => (score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low');

function calculateMetrics(module, comparison) {
  const confidence = confidenceToNumber[module.confidence] ?? 45;
  const baseImpact = module.savingsScore;
  const warningsPenalty = Math.min(18, (module.warnings?.length ?? 0) * 5);
  const actionSpecificityBoost = Math.min(8, Math.round((module.actionText?.length ?? 0) / 45));
  const impact = Math.max(0, Math.min(100, baseImpact - warningsPenalty + actionSpecificityBoost));

  // Deterministic effort heuristic: more data gaps + more differences => higher execution effort.
  const diffCount = comparison?.differences?.length ?? 0;
  const warningCount = module.warnings?.length ?? 0;
  const effort = Math.max(10, Math.min(100, 26 + diffCount * 5 + warningCount * 6));

  // Score formula requested by product spec.
  const score = Math.max(0, Math.min(100, Math.round((impact * 0.6 + confidence * 0.4) * (1 - effort / 120))));

  return { impact, effort, confidence, score };
}

function ValueAddScores({ materialA, materialB, comparison }) {
  if (!materialA || !materialB || !comparison) return null;

  const modules = buildValueAddedOutputs(comparison, materialA, materialB).map((module) => {
    const metrics = calculateMetrics(module, comparison);
    return { ...module, ...metrics, priorityIndex: metrics.score - metrics.effort * 0.25 };
  });

  const topThree = [...modules].sort((a, b) => b.priorityIndex - a.priorityIndex).slice(0, 3);

  return (
    <section className="panel">
      <h2>Value-Add Scores</h2>
      <div className="table-wrap score-table-wrap">
        <table className="diff-table score-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Score (0-100)</th>
              <th>Impact</th>
              <th>Effort</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((feature) => (
              <tr key={feature.title}>
                <td>{feature.title}</td>
                <td>
                  <div className="score-cell">
                    <span>{feature.score}</span>
                    <span className={`mini-gauge ${gaugeClass(feature.score)}`}>
                      <span style={{ width: `${feature.score}%` }} />
                    </span>
                  </div>
                </td>
                <td>{feature.impact}</td>
                <td>{feature.effort}</td>
                <td>{feature.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="priority-section">
        <h3>Highest Impact – Lowest Effort</h3>
        <div className="priority-grid">
          {topThree.map((feature) => {
            const template = featureTemplates[feature.title];
            return (
              <article key={feature.title} className="priority-card">
                <div className="priority-top">
                  <strong>{feature.title}</strong>
                  <span className="priority-index">Priority {feature.priorityIndex.toFixed(1)}</span>
                </div>
                <p><strong>Why it matters:</strong> {template.why}</p>
                <p><strong>What to do next:</strong></p>
                <ul>
                  {template.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
                <p><strong>Risk/Check:</strong> {template.risk}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ValueAddScores;
