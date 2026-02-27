import { useMemo } from 'react';
import { FEATURE_DETAILS_BY_SLUG } from '../data/features';
import { navigateTo } from '../utils/hashRouting';

function FeatureDetailPage({ slug }) {
  const feature = useMemo(() => FEATURE_DETAILS_BY_SLUG[slug], [slug]);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    navigateTo('/');
  };

  if (!feature) {
    return (
      <main className="content">
        <section className="panel feature-detail-page">
          <div className="detail-nav-row">
            <button className="back-button" onClick={handleBack} type="button">← Back</button>
            <button className="main-menu-link" type="button" onClick={() => navigateTo('/')}>Back to Main Menu</button>
          </div>
          <h1>Feature not found</h1>
          <p>The requested feature detail page does not exist.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="content">
      <section className="panel feature-detail-page">
        <div className="detail-nav-row">
          <button className="back-button" onClick={handleBack} type="button">← Back</button>
          <button className="main-menu-link" type="button" onClick={() => navigateTo('/')}>Back to Main Menu</button>
        </div>

        <h1>{feature.name}</h1>
        <p className="detail-short">{feature.shortDescription}</p>

        <h2>What it is</h2>
        {feature.sections.whatItIs.map((text) => (
          <p key={text}>{text}</p>
        ))}

        <h2>Why it matters</h2>
        {feature.sections.whyItMatters.map((text) => (
          <p key={text}>{text}</p>
        ))}

        <h2>How it works (simple steps)</h2>
        <ol>
          {feature.sections.howItWorks.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        <h2>Pitfalls / common mistakes</h2>
        <ul>
          {feature.sections.pitfalls.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>Example (concrete story with sample materials / parts)</h2>
        {feature.sections.example.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </section>
    </main>
  );
}

export default FeatureDetailPage;
