import { buildSavingsQualificationWorkflow } from './savingsQualificationWorkflow';

const MODULE_LENSES = [
  { title: 'Functional Substitution Engine', focus: 'substitution feasibility under constraints' },
  { title: 'Over-Specification Detection', focus: 'overkill spec and downgrade opportunities' },
  { title: 'Application-Based Intelligence', focus: 'context-sensitive application fit' },
  { title: 'Standards & Compliance Normalizer', focus: 'standards and certification alignment' },
  { title: 'Unit & Format Harmonization', focus: 'data consistency reducing ordering errors' },
  { title: 'Manufacturer & Part Number Enrichment', focus: 'cross-reference and sourcing speed' },
  { title: 'Interchangeability / Fit Check', focus: 'dimensional/interface interchangeability gates' },
  { title: 'Risk Scoring for Wrong Merge', focus: 'merge governance risk controls' },
  { title: 'Maintenance & Repair Guidance', focus: 'maintenance reliability and spare strategy' },
  { title: 'TCO Hints', focus: 'lifecycle economics and downtime cost' },
  { title: 'Preferred Vendor / Availability Hint', focus: 'availability and supplier resilience' },
  { title: 'BOM Impact Preview', focus: 'where-used and standardization impact' },
  { title: 'Data Quality Checklist & Autofix', focus: 'master-data completeness and autofix priorities' },
];

const lensWording = {
  'Functional Substitution Engine': {
    impact: 'Conditional substitution can unlock savings quickly when high-severity risk flags are gated before release.',
    action: 'Adopt top-ranked safe action only for assets matching validation answers and document excluded scenarios.',
  },
  'Over-Specification Detection': {
    impact: 'Spec-intent hypotheses indicate where premium classes may be unnecessary for the real duty envelope.',
    action: 'Test the lowest-effort downgrade candidate first and stop if any critical risk question remains unresolved.',
  },
  'Application-Based Intelligence': {
    impact: 'Savings potential changes materially by environment, contamination, duty cycle, and thermal profile.',
    action: 'Use validation questions as a mandatory intake checklist before approving any substitution path.',
  },
  'Standards & Compliance Normalizer': {
    impact: 'Certification and standard differences are direct cost drivers but also the highest compliance blockers.',
    action: 'Require documentary evidence for every standards-related risk flag before commercial consolidation.',
  },
  'Unit & Format Harmonization': {
    impact: 'Normalization reduces hidden procurement waste from wrong-unit ordering and receiving mismatches.',
    action: 'Prioritize autofix for fields tied to top cost drivers and enforce format rules before merge.',
  },
  'Manufacturer & Part Number Enrichment': {
    impact: 'Cross-brand enrichment improves alternate sourcing while preserving traceability for audits and quality claims.',
    action: 'Attach approved cross-reference plus validation proof for each ranked savings action.',
  },
  'Interchangeability / Fit Check': {
    impact: 'Fit-related risks drive downtime cost quickly; preventing one bad install can outweigh unit-price savings.',
    action: 'Execute geometry/interface validation steps first, then release only conditionally equivalent alternates.',
  },
  'Risk Scoring for Wrong Merge': {
    impact: 'Combining severity and workflow confidence exposes where merge errors could propagate plant-wide costs.',
    action: 'Block merge when critical risk flags exist and workflow confidence is below threshold.',
  },
  'Maintenance & Repair Guidance': {
    impact: 'Maintenance burden and spare complexity are primary hidden cost drivers across families.',
    action: 'Select actions that reduce PM variation and update spares lists after pilot confirmation.',
  },
  'TCO Hints': {
    impact: 'Cost drivers should be interpreted as lifecycle signals, not purchase-price signals only.',
    action: 'Quantify downtime, replacement interval, and labor effects for top two ranked savings actions.',
  },
  'Preferred Vendor / Availability Hint': {
    impact: 'Supplier concentration and lead-time fragility can erase nominal unit savings during disruptions.',
    action: 'Prioritize safe actions with lower qualification effort and resilient vendor availability.',
  },
  'BOM Impact Preview': {
    impact: 'Standardization gains scale only when where-used impact is controlled through change governance.',
    action: 'Apply top-ranked action first to low-criticality BOM nodes, then cascade after checks pass.',
  },
  'Data Quality Checklist & Autofix': {
    impact: 'Incomplete fields reduce confidence and force conservative decisions that delay savings capture.',
    action: 'Close mandatory data gaps identified by validation questions before approving broad substitutions.',
  },
};

const severityPoints = { Low: 18, Medium: 40, High: 68, Critical: 86 };

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const toConfidenceLevel = (value) => (value >= 0.75 ? 'High' : value >= 0.5 ? 'Medium' : 'Low');

export const buildValueAddedOutputs = (comparison, itemA, itemB) => {
  if (!comparison || !itemA || !itemB) return [];

  const workflow = buildSavingsQualificationWorkflow(itemA, itemB, comparison);
  const topCosts = workflow.costDrivers.slice(0, 3);
  const topRisks = workflow.riskFlags.slice(0, 3);
  const topActions = workflow.safeSavingsActions.slice(0, 3);

  return MODULE_LENSES.map((lens, index) => {
    const lensCopy = lensWording[lens.title];
    const severityAvg = topRisks.length
      ? topRisks.reduce((sum, r) => sum + (severityPoints[r.severity] ?? 30), 0) / topRisks.length
      : 20;

    const savingsBase =
      (comparison.score * 0.35) +
      (topCosts.length * 9) +
      (workflow.confidence * 26) +
      ((100 - severityAvg) * 0.22) +
      (topActions.length * 6) -
      (index % 3) * 3;

    const savingsScore = clamp(Math.round(savingsBase), 0, 100);

    const keyDrivers = [
      ...topCosts.map((x) => x.driver),
      ...topRisks.map((x) => `${x.severity}: ${x.risk}`),
      `workflow-confidence:${workflow.confidence.toFixed(2)}`,
    ].slice(0, 6);

    const warnings = workflow.riskFlags
      .filter((x) => x.severity === 'Critical' || x.severity === 'High')
      .slice(0, 4)
      .map((x) => `${x.severity} risk: ${x.risk}.`);

    return {
      title: lens.title,
      impactText: `${lensCopy.impact} Top cost signal: ${topCosts[0]?.driver || 'no dominant cost driver'}. ${workflow.narrative}`,
      actionText: `${lensCopy.action} Next best action: ${topActions[0]?.action || 'gather missing data before acting'}.`,
      verificationSteps: (topActions[0]?.validationSteps || []).slice(0, 3).concat(
        workflow.validationQuestions.slice(0, 2).map((q) => q.question),
      ).slice(0, 6),
      downstreamImpacts: [
        { area: 'Engineering & Specification', effect: workflow.specIntentHypotheses[0]?.reason || 'Spec intent remains unclear.' },
        { area: 'Compliance & Quality', effect: workflow.validationQuestions[0]?.whyItMatters || 'No blocking compliance question detected.' },
        { area: 'Procurement & Operations', effect: topActions[0]?.expectedSavingsHint || 'Savings impact needs additional validation.' },
      ],
      warnings,
      savingsLevers: topActions.map((x) => `${x.expectedSavingsHint} (${x.effort} validation effort)`).slice(0, 4),
      savingsScore,
      confidence: toConfidenceLevel(workflow.confidence),
      keyDrivers,
      workflow,
      valueChainAreas: [
        'Engineering & Specification',
        'Compliance & Certification',
        'Procurement & Supplier Risk',
        'Operations Continuity (Uptime)',
        'Cost (Unit Price + TCO)',
      ],
    };
  });
};

export { MODULE_LENSES };
