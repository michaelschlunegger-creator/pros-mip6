import FeatureAnalysis from './FeatureAnalysis';
import SavingsWorkflowSummary from './SavingsWorkflowSummary';
import { buildValueAddedOutputs } from '../utils/buildValueAddedOutputs';

function IntelligencePanel({ materialA, materialB, comparison }) {
  if (!materialA || !materialB || !comparison) return null;

  const modules = buildValueAddedOutputs(comparison, materialA, materialB);
  const workflow = modules[0]?.workflow;

  return (
    <details className="panel" open>
      <summary>PROSOL VALUE-ADDED INTELLIGENCE ANALYSIS</summary>
      <SavingsWorkflowSummary workflow={workflow} />
      <div className="feature-grid">
        {modules.map((module) => (
          <FeatureAnalysis key={module.title} module={module} />
        ))}
      </div>
    </details>
  );
}

export default IntelligencePanel;
