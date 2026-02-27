import { useMemo } from 'react';
import { buildValueAddedOutputs } from '../utils/buildValueAddedOutputs';
import { FEATURE_DETAILS_BY_NAME } from '../data/features';

const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)));
const gaugeClass = (score) => (score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low');

function calculateMetrics(module, comparison) {
  const featureDef = FEATURE_DETAILS_BY_NAME[module.title];
  if (!featureDef) {
    return { impact: 50, effort: 50, confidence: 50, score: 50, slug: 'unknown' };
  }

  const scoreBias = ((comparison?.score ?? 50) - 50) * 0.14;
  const warningPenalty = (module.warnings?.length ?? 0) * 1.8;
  const validationBoost = Math.min(6, (module.verificationSteps?.length ?? 0) * 0.9);

  const impact = clamp(featureDef.baseImpact + scoreBias - warningPenalty + validationBoost);
  const effort = clamp(featureDef.baseEffort + (module.warnings?.length ?? 0) * 1.5 + Math.max(0, ((comparison?.differences?.length ?? 0) - 4) * 0.5));
  const confidence = clamp(featureDef.baseConfidence + ((module.workflow?.confidence ?? 0.5) - 0.5) * 12 - (module.warnings?.length ?? 0) * 1.2);

  const score = clamp(Math.round(impact * 0.5 + confidence * 0.3 + (100 - effort) * 0.2));

  return { impact, effort, confidence, score, slug: featureDef.slug };
}

function ValueAddScores({ materialA, materialB, comparison, onOpenFeature }) {
  const modules = useMemo(() => {
    if (!materialA || !materialB || !comparison) return [];
    return buildValueAddedOutputs(comparison, materialA, materialB).map((module) => {
      const metrics = calculateMetrics(module, comparison);
      return { ...module, ...metrics, priorityIndex: metrics.score - metrics.effort * 0.25 };
    });
  }, [comparison, materialA, materialB]);

  if (!modules.length) return null;

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
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((feature) => (
              <tr
                key={feature.title}
                className="score-row-clickable"
                onClick={() => onOpenFeature(`/feature/${feature.slug}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onOpenFeature(`/feature/${feature.slug}`);
                  }
                }}
              >
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
                <td>
                  <button
                    type="button"
                    className="detail-link"
                    aria-label={`View details for ${feature.title}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenFeature(`/feature/${feature.slug}`);
                    }}
                  >
                    View details ↗
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="priority-section">
        <h3>Highest Impact – Lowest Effort</h3>
        <div className="priority-grid">
          {topThree.map((feature) => (
            <article key={feature.title} className="priority-card">
              <div className="priority-top">
                <strong>{feature.title}</strong>
                <span className="priority-index">Priority {feature.priorityIndex.toFixed(1)}</span>
              </div>
              <p><strong>Why it matters:</strong> {feature.impactText}</p>
              <p><strong>What to do next:</strong> {feature.actionText}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ValueAddScores;
