function severityClass(level) {
  return `severity-badge ${String(level || 'low').toLowerCase()}`;
}

function SavingsWorkflowSummary({ workflow }) {
  if (!workflow) return null;

  return (
    <section className="workflow-summary">
      <h3>Savings Qualification Workflow</h3>
      <p className="workflow-narrative">{workflow.narrative}</p>

      <div className="workflow-grid">
        <div className="workflow-card">
          <h4>Top 3 Cost Drivers</h4>
          <ul>
            {workflow.costDrivers.slice(0, 3).map((driver) => (
              <li key={driver.driver}><strong>{driver.driver}</strong> — {driver.costImpactHint}</li>
            ))}
          </ul>
        </div>

        <div className="workflow-card">
          <h4>Top 3 Risk Flags</h4>
          <ul>
            {workflow.riskFlags.slice(0, 3).map((risk) => (
              <li key={`${risk.risk}-${risk.severity}`}>
                <span className={severityClass(risk.severity)}>{risk.severity}</span> {risk.risk}
              </li>
            ))}
          </ul>
        </div>

        <div className="workflow-card">
          <h4>Validation Questions</h4>
          <ul>
            {workflow.validationQuestions.slice(0, 6).map((q) => (
              <li key={q.question} className="check-question">
                <input type="checkbox" readOnly />
                <span>{q.question}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="workflow-card">
        <h4>Top 3 Safe Savings Actions (Ranked)</h4>
        <ol>
          {workflow.safeSavingsActions.slice(0, 3).map((action) => (
            <li key={action.action}>
              <strong>{action.action}</strong>
              <div className="action-meta">{action.expectedSavingsHint} • Effort: {action.effort}</div>
            </li>
          ))}
        </ol>
      </div>

      <div className="confidence-meter" aria-label={`Workflow confidence ${(workflow.confidence * 100).toFixed(0)}%`}>
        <div className="confidence-meter-label">Confidence {(workflow.confidence * 100).toFixed(0)}%</div>
        <div className="confidence-meter-track">
          <div className="confidence-meter-fill" style={{ width: `${Math.round(workflow.confidence * 100)}%` }} />
        </div>
      </div>
    </section>
  );
}

export default SavingsWorkflowSummary;
