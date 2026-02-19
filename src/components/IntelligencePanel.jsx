import FeatureAnalysis from './FeatureAnalysis';
import { buildValueAddedOutputs } from '../utils/buildValueAddedOutputs';

function IntelligencePanel({ materialA, materialB, comparison }) {
  if (!materialA || !materialB || !comparison) return null;

  const modules = buildValueAddedOutputs(comparison, materialA, materialB);

  return (
    <details className="panel" open>
      <summary>PROSOL VALUE-ADDED INTELLIGENCE ANALYSIS</summary>
      <div className="feature-grid">
        {modules.map((module) => (
          <FeatureAnalysis key={module.title} module={module} />
        ))}
      </div>
    </details>
  );
}

export default IntelligencePanel;
