import TopNav from './components/TopNav';
import ComparisonCard from './components/ComparisonCard';
import SummaryPanel from './components/SummaryPanel';

const materials = [
  {
    id: 'mat-a',
    name: 'Aerospace Aluminum A220',
    specs: ['Density: 2.7 g/cm³', 'Tensile Strength: 540 MPa', 'Thermal Stability: High'],
    cost: '$1,420 / batch',
    sustainability: '78 / 100',
  },
  {
    id: 'mat-b',
    name: 'Carbon Composite C90',
    specs: ['Density: 1.8 g/cm³', 'Tensile Strength: 620 MPa', 'Thermal Stability: Very High'],
    cost: '$1,860 / batch',
    sustainability: '64 / 100',
  },
];

function App() {
  return (
    <div className="app-shell">
      <TopNav />

      <main className="content">
        <section className="dashboard-header">
          <h1>Material Comparison Dashboard</h1>
        </section>

        <section className="comparison-grid" aria-label="Material comparison cards">
          {materials.map((material) => (
            <ComparisonCard key={material.id} material={material} />
          ))}
        </section>

        <SummaryPanel />
      </main>
    </div>
  );
}

export default App;
