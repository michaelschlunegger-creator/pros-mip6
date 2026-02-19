import { useMemo, useState } from 'react';
import { MATERIALS } from './data/materials';
import { compareMaterials } from './utils/similarityEngine';
import MaterialSelector from './components/MaterialSelector';
import DifferencesTable from './components/DifferencesTable';
import IntelligencePanel from './components/IntelligencePanel';
import ValueAddScores from './components/ValueAddScores';

const categories = [
  'Ball Bearings',
  'Screws',
  'Valves',
  'Bushings',
  'Gaskets',
  'Hydraulic Fittings',
  'Electric Motors',
  'Seals',
  'Couplings',
  'Fasteners (Other)',
];

const fathimHints = [
  'Can I downgrade this spec safely?',
  'How do I validate equivalence?',
  'What’s the quickest saving lever?',
  'Any risks with lead time?',
  'Which change is low effort?',
];

function App() {
  const [category, setCategory] = useState('Screws');
  const [materialAId, setMaterialAId] = useState('');
  const [materialBId, setMaterialBId] = useState('');
  const [comparison, setComparison] = useState(null);
  const [showMockupNote, setShowMockupNote] = useState(false);

  const categoryMaterials = useMemo(
    () => MATERIALS.filter((item) => item.category === category),
    [category],
  );

  const materialA = categoryMaterials.find((m) => m.id === materialAId) || null;
  const materialB = categoryMaterials.find((m) => m.id === materialBId) || null;

  const onCategoryChange = (value) => {
    setCategory(value);
    setMaterialAId('');
    setMaterialBId('');
    setComparison(null);
  };

  const onCompare = () => {
    setComparison(compareMaterials(materialA, materialB));
  };

  const onAskFathimAI = () => {
    setShowMockupNote(true);
    window.setTimeout(() => setShowMockupNote(false), 2400);
  };

  return (
    <div className="app-shell">
      <header className="top-nav">
        <div className="brand">CODA • PROSOL MIP (Repo2)</div>
      </header>

      <main className="content">
        <section className="panel">
          <h1>PROSOL MIP – Duplicate Resolution Simulator</h1>
          <div className="controls-grid">
            <label className="control-group">
              <span>Main Category</span>
              <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <MaterialSelector
              label="Material A"
              options={categoryMaterials}
              value={materialAId}
              onChange={setMaterialAId}
              disabled={!categoryMaterials.length}
            />
            <MaterialSelector
              label="Material B"
              options={categoryMaterials}
              value={materialBId}
              onChange={setMaterialBId}
              disabled={!categoryMaterials.length}
            />
          </div>

          <div className="action-row">
            <button className="compare-button" onClick={onCompare} disabled={!materialA || !materialB || materialAId === materialBId}>
              Compare
            </button>
            <div className="mockup-wrap">
              <button className="fathim-button" onClick={onAskFathimAI} type="button">
                Ask FathimAI
              </button>
              {showMockupNote && <span className="mockup-toast">FathimAI is a mockup in this version.</span>}
            </div>
          </div>
        </section>

        {comparison && (
          <section className="panel score-panel">
            <p>Duplicate Similarity Score: <strong>{comparison.score}%</strong></p>
            <span className="score-badge">{comparison.score >= 70 ? 'Potential Duplicate' : 'Distinct Items'}</span>
          </section>
        )}

        <DifferencesTable materialA={materialA} materialB={materialB} />
        {comparison && <ValueAddScores materialA={materialA} materialB={materialB} comparison={comparison} />}
        <IntelligencePanel materialA={materialA} materialB={materialB} comparison={comparison} />
      </main>
    </div>
  );
}

export default App;
