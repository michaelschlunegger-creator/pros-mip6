const VALUE_CHAIN_AREAS = [
  'Engineering & Specification',
  'Compliance & Certification',
  'Procurement & Supplier Risk',
  'Lead Time & Availability',
  'Warehousing & Handling',
  'Installation & Fit',
  'Reliability & Maintenance',
  'Safety & Criticality',
  'Operations Continuity (Uptime)',
  'Cost (Unit Price + TCO)',
  'BOM / Asset Hierarchy & Standardization',
  'Change Control & Governance',
];

const MODULE_LENSES = [
  {
    title: 'Functional Substitution Engine',
    optimize: 'safe alternates under explicit engineering and risk constraints',
    areas: ['Engineering & Specification', 'Safety & Criticality', 'Operations Continuity (Uptime)'],
  },
  {
    title: 'Over-Specification Detection',
    optimize: 'downgrade or standardize only where duty envelope remains covered',
    areas: ['Engineering & Specification', 'Cost (Unit Price + TCO)', 'Reliability & Maintenance'],
  },
  {
    title: 'Application-Based Intelligence',
    optimize: 'fit-for-service recommendations by use environment and duty cycle',
    areas: ['Engineering & Specification', 'Reliability & Maintenance', 'Operations Continuity (Uptime)'],
  },
  {
    title: 'Standards & Compliance Normalizer',
    optimize: 'standard/cert alignment and audit-ready traceability',
    areas: ['Compliance & Certification', 'Safety & Criticality', 'Change Control & Governance'],
  },
  {
    title: 'Unit & Format Harmonization',
    optimize: 'master data consistency to prevent ordering and receiving errors',
    areas: ['Warehousing & Handling', 'Installation & Fit', 'BOM / Asset Hierarchy & Standardization'],
  },
  {
    title: 'Manufacturer & Part Number Enrichment',
    optimize: 'cross references and approved alternates for sourcing speed',
    areas: ['Procurement & Supplier Risk', 'Lead Time & Availability', 'Compliance & Certification'],
  },
  {
    title: 'Interchangeability / Fit Check',
    optimize: 'dimensional/interface compatibility before field swap',
    areas: ['Installation & Fit', 'Reliability & Maintenance', 'Operations Continuity (Uptime)'],
  },
  {
    title: 'Risk Scoring for Wrong Merge',
    optimize: 'governance gate to block high-risk merges without approvals',
    areas: ['Safety & Criticality', 'Change Control & Governance', 'Compliance & Certification'],
  },
  {
    title: 'Maintenance & Repair Guidance',
    optimize: 'spares and PM strategy to reduce failures and repair time',
    areas: ['Reliability & Maintenance', 'Operations Continuity (Uptime)', 'Lead Time & Availability'],
  },
  {
    title: 'TCO Hints',
    optimize: 'lifecycle cost tradeoffs beyond purchase price',
    areas: ['Cost (Unit Price + TCO)', 'Reliability & Maintenance', 'Operations Continuity (Uptime)'],
  },
  {
    title: 'Preferred Vendor / Availability Hint',
    optimize: 'supply resilience through lead-time and dual-source strategy',
    areas: ['Procurement & Supplier Risk', 'Lead Time & Availability', 'Operations Continuity (Uptime)'],
  },
  {
    title: 'BOM Impact Preview',
    optimize: 'where-used and hierarchy effects before standardization changes',
    areas: ['BOM / Asset Hierarchy & Standardization', 'Change Control & Governance', 'Operations Continuity (Uptime)'],
  },
  {
    title: 'Data Quality Checklist & Autofix',
    optimize: 'master-data completeness and deterministic autofix actions',
    areas: ['BOM / Asset Hierarchy & Standardization', 'Warehousing & Handling', 'Change Control & Governance'],
  },
];

const FAMILY_HEURISTICS = {
  fasteners: {
    aliases: ['Screws', 'Fasteners (Other)'],
    criticalSpecs: ['diameter', 'length', 'materialGrade', 'coating', 'standard', 'tolerance', 'loadRating'],
    failureRisks: ['loss of preload', 'fatigue cracking', 'galvanic/corrosion mismatch', 'torque variation and joint loosening'],
    complianceNeeds: ['DIN/ISO dimensional conformity', 'material certificates (3.1 when required)', 'torque class traceability'],
    procurementConcerns: ['counterfeit risk in commodity channels', 'lot-to-lot coating variability', 'MOQ-driven SKU proliferation'],
    maintenanceImplications: ['retorque intervals', 'planned replacement for critical joints', 'thread condition controls during overhaul'],
    substitutionPatterns: ['same diameter/length/grade/standard may substitute', 'coating changes require corrosion and torque check', 'grade downgrade is blocked for structural joints'],
    criticalityBias: 0.52,
  },
  bearings: {
    aliases: ['Ball Bearings'],
    criticalSpecs: ['diameter', 'size', 'materialGrade', 'tolerance', 'loadRating', 'temperatureRange', 'standard'],
    failureRisks: ['lubrication starvation', 'misalignment and vibration', 'premature spalling', 'heat generation from internal clearance mismatch'],
    complianceNeeds: ['ISO bearing tolerance class verification', 'noise/vibration acceptance where rotating assets are critical'],
    procurementConcerns: ['OEM-specific suffix availability', 'long lead times for precision classes', 'counterfeit premium-brand exposure'],
    maintenanceImplications: ['lubrication interval impact', 'MTBF shift under altered load rating', 'shutdown window sensitivity'],
    substitutionPatterns: ['same envelope and dynamic/static ratings may substitute', 'clearance class changes require engineering review', 'sealing variant changes alter lubrication plan'],
    criticalityBias: 0.74,
  },
  valves: {
    aliases: ['Valves'],
    criticalSpecs: ['size', 'pressureRating', 'temperatureRange', 'materialGrade', 'standard', 'tolerance'],
    failureRisks: ['seat leakage', 'isolation failure', 'cavitation/erosion', 'actuation incompatibility'],
    complianceNeeds: ['pressure equipment standard compliance', 'fire-safe or fugitive-emission certification when applicable', 'traceable pressure class documentation'],
    procurementConcerns: ['extended lead times for certified trims', 'single-source actuator pairings', 'documentation package availability'],
    maintenanceImplications: ['spare trim kit strategy', 'stroke test frequency changes', 'permit-to-work downtime exposure'],
    substitutionPatterns: ['same pressure class/media compatibility may substitute', 'trim material changes need process hazard review', 'connection standard mismatch is non-substitutable'],
    criticalityBias: 0.9,
  },
  gaskets: {
    aliases: ['Gaskets'],
    criticalSpecs: ['diameter', 'size', 'materialGrade', 'temperatureRange', 'pressureRating', 'standard'],
    failureRisks: ['creep relaxation', 'chemical incompatibility', 'blowout under pressure cycling'],
    complianceNeeds: ['flange standard match', 'material compliance for process media', 'traceable batch certificates for critical service'],
    procurementConcerns: ['sheet material volatility', 'cut-to-size lead time', 'obsolescence of legacy dimensions'],
    maintenanceImplications: ['replacement frequency in PM shutdowns', 'bolt retorque sequence dependency', 'flange-face inspection burden'],
    substitutionPatterns: ['same facing dimension and media class may substitute', 'material swap requires compatibility validation', 'thickness changes alter bolt load calculation'],
    criticalityBias: 0.78,
  },
  seals: {
    aliases: ['Seals'],
    criticalSpecs: ['diameter', 'materialGrade', 'temperatureRange', 'tolerance', 'standard'],
    failureRisks: ['hardening/swelling from media', 'lip wear', 'leakage due to shaft runout mismatch'],
    complianceNeeds: ['elastomer compatibility declaration', 'traceability for critical containment equipment'],
    procurementConcerns: ['compound-specific shortages', 'OEM profile dependency', 'counterfeit aftermarket blends'],
    maintenanceImplications: ['seal life and planned downtime cadence', 'shaft sleeve inspection and replacement strategy'],
    substitutionPatterns: ['same geometry and elastomer class may substitute', 'material upgrades can extend life but need friction/temperature check'],
    criticalityBias: 0.8,
  },
  bushings: {
    aliases: ['Bushings'],
    criticalSpecs: ['diameter', 'length', 'materialGrade', 'tolerance', 'loadRating'],
    failureRisks: ['excess clearance wear', 'seizure under poor lubrication', 'misalignment and vibration'],
    complianceNeeds: ['dimensional tolerance compliance', 'material hardness evidence for heavy duty'],
    procurementConcerns: ['machined vs standard sleeve availability', 'lead time spikes for specialty alloys'],
    maintenanceImplications: ['inspection intervals for wear trend', 'reconditioning plan for shafts/housings'],
    substitutionPatterns: ['same ID/OD/length with equal load class may substitute', 'material changes alter lubrication and wear profile'],
    criticalityBias: 0.7,
  },
  fittings: {
    aliases: ['Hydraulic Fittings'],
    criticalSpecs: ['diameter', 'pressureRating', 'materialGrade', 'standard', 'temperatureRange'],
    failureRisks: ['thread mismatch leakage (BSP/NPT)', 'burst failure', 'vibration-driven loosening'],
    complianceNeeds: ['pressure standard conformance', 'hydraulic cleanliness and leak-test documentation'],
    procurementConcerns: ['special thread forms with long replenishment', 'plating compliance constraints'],
    maintenanceImplications: ['leak detection workload', 'retightening/torque program', 'hose and fitting compatibility checks'],
    substitutionPatterns: ['same thread form and pressure class may substitute', 'mixing seal standards requires engineering approval'],
    criticalityBias: 0.88,
  },
  motors: {
    aliases: ['Electric Motors'],
    criticalSpecs: ['size', 'materialGrade', 'tolerance', 'loadRating', 'standard', 'temperatureRange'],
    failureRisks: ['overheating', 'control incompatibility', 'bearing/electrical insulation degradation'],
    complianceNeeds: ['IEC/NEMA standard alignment', 'efficiency class compliance (IE)', 'IP protection class verification'],
    procurementConcerns: ['long lead times for premium efficiency motors', 'single-brand drive compatibility'],
    maintenanceImplications: ['spare motor strategy by frame size', 'alignment and vibration baseline updates', 'energy-performance monitoring'],
    substitutionPatterns: ['frame/mount and electrical characteristics must match', 'efficiency upgrades possible with control review'],
    criticalityBias: 0.86,
  },
  couplings: {
    aliases: ['Couplings'],
    criticalSpecs: ['diameter', 'size', 'materialGrade', 'tolerance', 'loadRating', 'standard'],
    failureRisks: ['torsional overload', 'misalignment fatigue', 'elastomer element deterioration'],
    complianceNeeds: ['torque and speed envelope traceability', 'guarding and rotating equipment safety checks'],
    procurementConcerns: ['insert availability by brand family', 'legacy hub bores with long machining lead time'],
    maintenanceImplications: ['alignment checks during PM', 'insert replacement stocking', 'vibration and backlash monitoring'],
    substitutionPatterns: ['same bore/interface and torque class may substitute', 'hub profile mismatch blocks direct replacement'],
    criticalityBias: 0.76,
  },
  other: {
    aliases: [],
    criticalSpecs: ['diameter', 'length', 'size', 'materialGrade', 'standard', 'loadRating', 'pressureRating', 'temperatureRange'],
    failureRisks: ['fit mismatch', 'performance drift', 'premature wear when duty assumptions differ'],
    complianceNeeds: ['standard and certificate traceability', 'approval evidence for substitutions'],
    procurementConcerns: ['fragmented supplier base', 'incomplete catalog mapping'],
    maintenanceImplications: ['inconsistent spare usage', 'unplanned troubleshooting effort'],
    substitutionPatterns: ['substitute only with matching dimensions, rating, and standard unless approved by engineering'],
    criticalityBias: 0.68,
  },
};

const MANDATORY_FIELDS = ['fullName', 'category', 'standard', 'materialGrade', 'brand', 'temperatureRange'];

const normalize = (value) => (value ?? '').toString().trim().toLowerCase();
const safeNum = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

const hashSeed = (text) => text.split('').reduce((sum, ch, index) => sum + ch.charCodeAt(0) * (index + 3), 0);

const familyForCategory = (category) => {
  const entry = Object.entries(FAMILY_HEURISTICS).find(([, heuristic]) =>
    heuristic.aliases.some((alias) => normalize(alias) === normalize(category)),
  );
  return entry ? entry[0] : 'other';
};

const computeMissingFields = (item, fields) => fields.filter((field) => !normalize(item[field]));

const extractCriticalDiffs = (itemA, itemB, heuristic) =>
  heuristic.criticalSpecs.filter((field) => normalize(itemA[field]) !== normalize(itemB[field]));

const inferCriticality = (itemA, itemB, heuristic) => {
  const pressureTagged = /pn\d+|ansi\s*\d+/i.test(`${itemA.pressureRating ?? ''} ${itemB.pressureRating ?? ''}`);
  const highTolerance = /ip6|h6|p5|r2|t[7-9]/i.test(`${itemA.tolerance ?? ''} ${itemB.tolerance ?? ''}`);
  const highLoad = safeNum((itemA.loadRating ?? '').replace(/[^\d.]/g, '')) > 15 || safeNum((itemB.loadRating ?? '').replace(/[^\d.]/g, '')) > 15;

  let score = heuristic.criticalityBias;
  if (pressureTagged) score += 0.08;
  if (highTolerance) score += 0.05;
  if (highLoad) score += 0.04;
  return Math.min(0.98, score);
};

const determineConfidence = ({ missingCount, criticalDiffCount, standardsDiffer, criticality }) => {
  let confidenceScore = 88;
  confidenceScore -= missingCount * 5;
  confidenceScore -= criticalDiffCount * 6;
  if (standardsDiffer) confidenceScore -= 12;
  if (criticality >= 0.85) confidenceScore -= 8;

  if (confidenceScore >= 72) return 'High';
  if (confidenceScore >= 48) return 'Medium';
  return 'Low';
};

const choosePhrase = (phrases, seed) => phrases[seed % phrases.length];

const makeSavingsScore = ({ similarity, costDeltaPct, criticalDiffCount, criticality, standardsDiffer, missingCount, moduleIndex }) => {
  const inventoryReduction = similarity * 0.32;
  const procurementConsolidation = Math.max(0, similarity - criticalDiffCount * 6) * 0.18;
  const downtimeReduction = Math.max(0, 80 - criticalDiffCount * 10) * (0.16 + criticality * 0.08);
  const complianceRiskReduction = (standardsDiffer ? 78 : 42) * 0.11;
  const leadTimeRiskReduction = Math.max(0, 70 - missingCount * 10) * 0.1;
  const maintenanceSimplification = Math.max(0, 72 - criticalDiffCount * 7) * 0.08;
  const bomStandardization = Math.max(0, similarity - missingCount * 4) * 0.05;

  const moduleOffset = ((moduleIndex * 7) % 9) - 4;
  const costInfluence = Math.min(18, costDeltaPct * 0.35);

  const total =
    inventoryReduction +
    procurementConsolidation +
    downtimeReduction +
    complianceRiskReduction +
    leadTimeRiskReduction +
    maintenanceSimplification +
    bomStandardization +
    costInfluence +
    moduleOffset;

  return Math.max(0, Math.min(100, Math.round(total)));
};

const buildDownstreamImpacts = (lens, heuristic, keyDrivers) => {
  const base = [
    { area: 'Maintenance planning', effect: `PM scope shifts with ${heuristic.failureRisks[0]}.` },
    { area: 'Operations uptime', effect: `Unexpected substitution errors can increase stoppage probability during changeovers.` },
    { area: 'Procurement execution', effect: `Approved alternates improve PO cycle time when primary suppliers are constrained.` },
    { area: 'Governance', effect: `Change records should capture ${lens.title.toLowerCase()} decisions for audit traceability.` },
  ];

  if (keyDrivers.some((driver) => driver.includes('standard'))) {
    base.unshift({ area: 'Regulatory compliance', effect: 'Standard mismatch can trigger additional certification and sign-off effort.' });
  }

  return base.slice(0, 6);
};

const buildVerificationSteps = (lens, heuristic, itemA, itemB, criticalDiffs) => {
  const steps = [
    `Compare critical specs (${heuristic.criticalSpecs.slice(0, 4).join(', ')}) for ${itemA.id} and ${itemB.id}.`,
    `Validate ${lens.areas[0]} evidence in datasheets and internal spec records before approval.`,
    `Confirm supplier documentation covers ${heuristic.complianceNeeds[0]}.`,
    `Run a pilot in one asset train and capture installation/commissioning observations.`,
    'Submit merge or substitution decision through engineering + maintenance workflow with documented sign-off.',
  ];

  if (criticalDiffs.length) {
    steps.splice(2, 0, `Perform focused check on differing critical specs: ${criticalDiffs.slice(0, 3).join(', ')}.`);
  }

  return steps.slice(0, 6);
};

const buildWarnings = ({ criticalDiffs, standardsDiffer, missingFields, heuristic, lens }) => {
  const warnings = [];
  if (criticalDiffs.length >= 3) warnings.push(`High critical-spec delta (${criticalDiffs.join(', ')}) — do not auto-merge.`);
  if (standardsDiffer) warnings.push('Standards differ between records; compliance approval is mandatory before consolidation.');
  if (missingFields.length) warnings.push(`Missing master-data fields: ${missingFields.slice(0, 3).join(', ')}.`);
  if (lens.title.includes('Interchangeability') || lens.title.includes('Functional')) {
    warnings.push(`Family-specific risk to monitor: ${heuristic.failureRisks[0]}.`);
  }
  return warnings.slice(0, 4);
};

const buildSavingsLevers = (lens, heuristic) => [
  `Inventory reduction via standardizing equivalent ${heuristic.aliases[0] || 'parts'} SKUs across sites.`,
  `Procurement consolidation using approved alternate list tied to ${lens.areas[0]}.`,
  'Downtime risk reduction by pre-validating fit, rating, and installation constraints.',
  'Maintenance simplification through aligned spare strategy and PM instructions.',
].slice(0, 4);

export const buildValueAddedOutputs = (comparison, itemA, itemB) => {
  if (!comparison || !itemA || !itemB) return [];

  const family = familyForCategory(itemA.category);
  const heuristic = FAMILY_HEURISTICS[family] || FAMILY_HEURISTICS.other;
  const similarity = comparison.score ?? 0;
  const costDeltaPct = Math.round((Math.abs(safeNum(itemA.cost) - safeNum(itemB.cost)) / Math.max(safeNum(itemA.cost), safeNum(itemB.cost), 1)) * 100);
  const standardsDiffer = normalize(itemA.standard) !== normalize(itemB.standard);
  const criticalDiffs = extractCriticalDiffs(itemA, itemB, heuristic);
  const missingFields = [...new Set([...computeMissingFields(itemA, MANDATORY_FIELDS), ...computeMissingFields(itemB, MANDATORY_FIELDS)])];
  const criticality = inferCriticality(itemA, itemB, heuristic);

  return MODULE_LENSES.map((lens, moduleIndex) => {
    const seed = hashSeed(`${lens.title}-${itemA.category}-${criticalDiffs.join('|')}-${similarity}`);
    const variationPhrase = choosePhrase(
      [
        'This module highlights value-chain consequences beyond inventory simplification.',
        'This view emphasizes cross-functional impact from engineering through operations.',
        'This analysis links procurement, reliability, and governance in one decision path.',
      ],
      seed,
    );

    const driverCandidates = [
      standardsDiffer ? 'standard mismatch' : 'standard alignment',
      criticalDiffs.length ? `critical spec deltas: ${criticalDiffs.slice(0, 3).join(', ')}` : 'critical specs closely aligned',
      costDeltaPct >= 15 ? `cost delta ${costDeltaPct}%` : 'limited unit cost delta',
      missingFields.length ? `missing data: ${missingFields.slice(0, 2).join(', ')}` : 'core fields complete',
      `family risk: ${heuristic.failureRisks[0]}`,
    ];

    const confidence = determineConfidence({
      missingCount: missingFields.length,
      criticalDiffCount: criticalDiffs.length,
      standardsDiffer,
      criticality,
    });

    return {
      title: lens.title,
      impactText: `${lens.title} evaluates ${itemA.fullName} versus ${itemB.fullName} to optimize ${lens.optimize}. ${variationPhrase} Focus areas: ${lens.areas.slice(0, 2).join(' + ')}.`,
      actionText: `Prioritize ${lens.areas[0]} review and execute a controlled approval route before any merge/substitution. Use ${heuristic.substitutionPatterns[0]} as the default rule, then escalate deviations.`,
      verificationSteps: buildVerificationSteps(lens, heuristic, itemA, itemB, criticalDiffs),
      downstreamImpacts: buildDownstreamImpacts(lens, heuristic, driverCandidates),
      warnings: buildWarnings({ criticalDiffs, standardsDiffer, missingFields, heuristic, lens }),
      savingsLevers: buildSavingsLevers(lens, heuristic),
      savingsScore: makeSavingsScore({
        similarity,
        costDeltaPct,
        criticalDiffCount: criticalDiffs.length,
        criticality,
        standardsDiffer,
        missingCount: missingFields.length,
        moduleIndex,
      }),
      confidence,
      keyDrivers: driverCandidates,
      valueChainAreas: lens.areas,
      family,
    };
  });
};

export { VALUE_CHAIN_AREAS, FAMILY_HEURISTICS, MODULE_LENSES };
