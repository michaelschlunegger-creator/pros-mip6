function SavingsDial({ score }) {
  const radius = 28;
  const stroke = 7;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const dashoffset = circumference - (score / 100) * circumference;
  const tier = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low';

  return (
    <div className="savings-dial" aria-label={`Savings Potential ${score} (${tier})`}>
      <svg viewBox="0 0 56 56" role="img">
        <circle className="dial-track" cx="28" cy="28" r={normalizedRadius} />
        <circle
          className="dial-progress"
          cx="28"
          cy="28"
          r={normalizedRadius}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
        />
      </svg>
      <div className="dial-center">
        <span className="dial-value">{score}</span>
      </div>
      <div className="dial-meta">
        <span className="dial-label">Savings Potential</span>
        <strong>{tier}</strong>
      </div>
    </div>
  );
}

function renderList(items) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function FeatureAnalysis({ module }) {
  return (
    <article className="feature-card">
      <div className="feature-top">
        <h4>{module.title}</h4>
        <span className={`confidence-pill ${module.confidence.toLowerCase()}`}>Confidence: {module.confidence}</span>
      </div>

      <SavingsDial score={module.savingsScore} />

      <p><strong>Business impact:</strong> {module.impactText}</p>
      <p><strong>Recommended action:</strong> {module.actionText}</p>

      <details className="feature-detail-block" open>
        <summary>Verification steps</summary>
        {renderList(module.verificationSteps)}
      </details>

      <details className="feature-detail-block" open>
        <summary>Downstream impacts</summary>
        <ul>
          {module.downstreamImpacts.map((impact) => (
            <li key={`${impact.area}-${impact.effect}`}><strong>{impact.area}:</strong> {impact.effect}</li>
          ))}
        </ul>
      </details>

      {!!module.warnings.length && (
        <details className="feature-detail-block" open>
          <summary>Warnings</summary>
          {renderList(module.warnings)}
        </details>
      )}

      <details className="feature-detail-block" open>
        <summary>Savings levers</summary>
        {renderList(module.savingsLevers)}
      </details>

      <details className="feature-detail-block">
        <summary>Key drivers</summary>
        {renderList(module.keyDrivers)}
      </details>
    </article>
  );
}

export default FeatureAnalysis;
