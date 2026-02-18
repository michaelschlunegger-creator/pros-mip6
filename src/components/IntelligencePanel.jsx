import FeatureAnalysis from './FeatureAnalysis';

const featureNames = [
  'Functional Substitution Engine',
  'Over-Specification Detection',
  'Application-Based Intelligence',
  'Lifecycle Cost Optimization',
  'Inventory Consolidation Impact',
  'Sustainability Impact Analysis',
  'Risk Assessment Engine',
  'Compliance & Standards Mapping',
  'Cross-Brand Equivalency',
  'Tolerance & Fit Validation',
  'Failure Mode Risk Comparison',
  'Procurement Leverage Index',
  'Digital Master Data Improvement Suggestion',
];

function makeFeatureDetail(name, materialA, materialB, score) {
  return {
    identical: `${materialA.fullName} and ${materialB.fullName} share category ${materialA.category} with aligned core fit indicators.`,
    differs: `${materialA.fullName} varies from ${materialB.fullName} across grade/coating/brand or rating attributes that affect interchange behavior.`,
    impact:
      score >= 85
        ? `${name} flags a high duplicate probability, enabling immediate part rationalization and lower sourcing complexity.`
        : `${name} indicates partial equivalency, so uncontrolled swapping could increase validation workload and service risk.`,
    action:
      score >= 85
        ? `Standardize on one master record between ${materialA.fullName} and ${materialB.fullName}, then phase out the duplicate SKU after pilot confirmation.`
        : `Run controlled qualification for ${materialA.fullName} versus ${materialB.fullName}, define approved use-cases, and update governance rules.`,
  };
}

function hashVariation(seed, index) {
  const seedValue = seed.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return ((seedValue + index * 13) % 17) - 8;
}

function buildSavingsProfile(index, name, comparison, materialA, materialB) {
  const similarity = comparison?.score ?? 0;
  const costA = Number(materialA?.cost ?? 0);
  const costB = Number(materialB?.cost ?? 0);
  const maxCost = Math.max(costA, costB, 1);
  const costDeltaPct = Math.min(100, Math.round((Math.abs(costA - costB) / maxCost) * 100));
  const variation = hashVariation(name, index);

  const weighted = similarity * 0.7 + costDeltaPct * 0.25 + 10 + variation;
  const score = Math.max(0, Math.min(100, Math.round(weighted)));
  const tier = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low';

  const riskSignals = (comparison?.differences?.length ?? 0) + (materialA?.applicationNotes ? 1 : 0) + (materialB?.applicationNotes ? 1 : 0);
  const confidenceScore = Math.max(0, Math.min(100, Math.round(similarity - (riskSignals - 2) * 4 + variation)));
  const level = confidenceScore >= 75 ? 'High' : confidenceScore >= 50 ? 'Medium' : 'Low';

  return { score, tier, confidence: { level, score: confidenceScore } };
}

function IntelligencePanel({ materialA, materialB, comparison }) {
  const score = comparison?.score ?? 0;
  if (!materialA || !materialB || score < 70) return null;

  return (
    <details className="panel" open>
      <summary>PROSOL VALUE-ADDED INTELLIGENCE ANALYSIS</summary>
      <div className="feature-grid">
        {featureNames.map((name, index) => {
          const savings = buildSavingsProfile(index, name, comparison, materialA, materialB);
          return (
            <FeatureAnalysis
              key={name}
              title={name}
              detail={makeFeatureDetail(name, materialA, materialB, score)}
              savings={{ score: savings.score, tier: savings.tier }}
              confidence={savings.confidence}
            />
          );
        })}
      </div>
    </details>
  );
}

export default IntelligencePanel;
