function SavingsDial({ score, tier }) {
  const radius = 28;
  const stroke = 7;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const dashoffset = circumference - (score / 100) * circumference;

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

function FeatureAnalysis({ title, detail, savings, confidence }) {
  return (
    <article className="feature-card">
      <div className="feature-top">
        <h4>{title}</h4>
        <span className={`confidence-pill ${confidence.level.toLowerCase()}`}>Confidence: {confidence.level}</span>
      </div>
      <SavingsDial score={savings.score} tier={savings.tier} />
      <ul>
        <li>
          <strong>What is identical:</strong> {detail.identical}
        </li>
        <li>
          <strong>What differs:</strong> {detail.differs}
        </li>
        <li>
          <strong>Business impact:</strong> {detail.impact}
        </li>
        <li>
          <strong>Recommended action:</strong> {detail.action}
        </li>
      </ul>
    </article>
  );
}

export default FeatureAnalysis;
