function severityClass(level) {
  return `severity-badge ${String(level || 'low').toLowerCase()}`;
}

function recommendationFromWorkflow(workflow) {
  const topDriver = workflow.costDrivers[0];
  const topAction = workflow.safeSavingsActions[0];
  const topRisk = workflow.riskFlags[0];
  if (!topDriver || !topAction) return null;

  return {
    title: 'Highest Impact – Lowest Effort',
    why: `${topDriver.driverKey} is currently the strongest savings lever with manageable validation effort for this family.`,
    next: [
      `Validate ${topDriver.driverKey} boundary conditions on one representative asset.`,
      `Execute action: ${topAction.action}`,
      'Release via controlled change after pilot evidence is reviewed.',
    ],
    risk: topRisk ? `${topRisk.severity} risk to monitor: ${topRisk.risk}` : 'No critical risk flag detected.',
  };
}

function SavingsWorkflowSummary({ workflow }) {
  if (!workflow) return null;
  const recommendation = recommendationFromWorkflow(workflow);

  return (
    <section className="workflow-summary">
      <h3>Savings Qualification Workflow</h3>
      <p className="workflow-narrative">{workflow.narrative}</p>

      <div className="workflow-grid">
        <div className="workflow-card">
          <h4>Top 3 Cost Drivers</h4>
          <ul>
            {workflow.costDrivers.slice(0, 3).map((driver) => (
              <li key={driver.driverKey}>
                <strong>{driver.driverKey}</strong> — {driver.intent}
                <div className="action-meta">Savings hypothesis: {driver.savingsHypothesis}</div>
              </li>
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
              <li key={q.id} className="check-question">
                <input type="checkbox" readOnly />
                <div>
                  <span>{q.question}</span>
                  <div className="question-subtext"><strong>Why it matters:</strong> {q.whyItMatters}</div>
                  <div className="question-subtext"><strong>What to check:</strong> {q.whatToCheck}</div>
                  <div className="question-subtext"><strong>Risk if wrong:</strong> {q.riskIfWrong}</div>
                </div>
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
              <div className="action-meta">Drivers: {action.relatedDrivers.join(', ')} • {action.expectedSavingsHint} • Effort: {action.effort}</div>
            </li>
          ))}
        </ol>
      </div>

      {recommendation && (
        <div className="workflow-card recommendation-card">
          <h4>{recommendation.title}</h4>
          <p className="workflow-narrative">{recommendation.why}</p>
          <ul>
            {recommendation.next.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <p className="workflow-narrative"><strong>Risk/Check:</strong> {recommendation.risk}</p>
        </div>
      )}

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
