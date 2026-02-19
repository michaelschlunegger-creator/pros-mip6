const ATTRIBUTE_MEANING = {
  coating: {
    intent: 'corrosion/friction control',
    costDriver: 'surface treatment premium',
    risk: 'premature corrosion or torque behavior shift',
    severity: 'Medium',
  },
  materialGrade: {
    intent: 'mechanical strength and durability margin',
    costDriver: 'alloy/grade premium',
    risk: 'strength margin reduction or accelerated wear',
    severity: 'High',
  },
  loadRating: {
    intent: 'mechanical load capability',
    costDriver: 'capacity class premium',
    risk: 'overload and early failure',
    severity: 'High',
  },
  pressureRating: {
    intent: 'process pressure safety margin',
    costDriver: 'pressure-class premium',
    risk: 'leakage or pressure boundary failure',
    severity: 'High',
  },
  pressureClass: {
    intent: 'process pressure safety margin',
    costDriver: 'pressure-class premium',
    risk: 'containment or seal integrity loss',
    severity: 'High',
  },
  standard: {
    intent: 'interface and compliance compatibility',
    costDriver: 'certified standard compliance',
    risk: 'non-compliance or interchange mismatch',
    severity: 'High',
  },
  certification: {
    intent: 'regulatory/legal qualification',
    costDriver: 'certification/testing overhead',
    risk: 'audit failure or legal exposure',
    severity: 'High',
  },
  tolerance: {
    intent: 'fit and precision behavior',
    costDriver: 'precision machining premium',
    risk: 'fitment rework, vibration, or leakage',
    severity: 'Medium',
  },
  precisionClass: {
    intent: 'performance/precision target',
    costDriver: 'precision class premium',
    risk: 'efficiency or lifetime degradation',
    severity: 'Medium',
  },
  diameter: {
    intent: 'mechanical fit envelope',
    costDriver: 'size/material consumption',
    risk: 'installation mismatch and rework',
    severity: 'High',
  },
  length: {
    intent: 'mechanical fit envelope',
    costDriver: 'machining/material consumption',
    risk: 'installation mismatch and rework',
    severity: 'Medium',
  },
  size: {
    intent: 'interface and mounting compatibility',
    costDriver: 'frame/size class premium',
    risk: 'mounting incompatibility and downtime',
    severity: 'High',
  },
  temperatureRange: {
    intent: 'thermal operating envelope',
    costDriver: 'high-temp material/elastomer premium',
    risk: 'seal hardening, drift, or thermal failure',
    severity: 'High',
  },
  sealType: {
    intent: 'leakage and contamination control',
    costDriver: 'seal technology premium',
    risk: 'leakage, contamination, or ingress',
    severity: 'High',
  },
  brand: {
    intent: 'supplier quality/performance assurance',
    costDriver: 'brand premium',
    risk: 'quality variability or lead-time volatility',
    severity: 'Medium',
  },
  ipRating: {
    intent: 'environmental ingress protection',
    costDriver: 'enclosure/protection premium',
    risk: 'ingress-related failure',
    severity: 'High',
  },
  hazardousArea: {
    intent: 'hazardous area compliance',
    costDriver: 'hazard-rated design premium',
    risk: 'unsafe operation in hazardous zones',
    severity: 'Critical',
  },
};

const normalize = (value) => (value ?? '').toString().trim();
const toLower = (value) => normalize(value).toLowerCase();

const CORE_FIELDS = Object.keys(ATTRIBUTE_MEANING);

const severityWeight = { Low: 1, Medium: 2, High: 3, Critical: 4 };

const inferHigherSpec = (field, a, b) => {
  const va = normalize(a[field]);
  const vb = normalize(b[field]);
  if (!va || !vb) return null;

  if (field === 'temperatureRange') {
    const parseMax = (r) => {
      const m = r.match(/\.\.(-?\d+)/);
      return m ? Number(m[1]) : -999;
    };
    return parseMax(va) >= parseMax(vb) ? 'A' : 'B';
  }

  if (field === 'pressureRating' || field === 'pressureClass' || field === 'loadRating') {
    const num = (text) => Number((text.match(/-?\d+(\.\d+)?/) || ['0'])[0]);
    return num(va) >= num(vb) ? 'A' : 'B';
  }

  if (field === 'precisionClass') {
    const rank = ['standard', 'p0', 'p6', 'p5', 'class iv', 'class v', 'class vi', 'tight finish', 'leak-tight', 'ie2', 'ie3', 'ie4'];
    const ia = rank.findIndex((x) => toLower(va).includes(x));
    const ib = rank.findIndex((x) => toLower(vb).includes(x));
    return ia >= ib ? 'A' : 'B';
  }

  return null;
};

const uniqueBy = (arr, keyFn) => {
  const seen = new Set();
  return arr.filter((item) => {
    const k = keyFn(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

export function buildSavingsQualificationWorkflow(itemA, itemB, comparison) {
  const diffFields = CORE_FIELDS.filter((field) => toLower(itemA[field]) !== toLower(itemB[field]));

  const hypotheses = diffFields.map((field) => {
    const meaning = ATTRIBUTE_MEANING[field];
    const higherSpec = inferHigherSpec(field, itemA, itemB);
    const sourceLabel = higherSpec ? `Material ${higherSpec}` : 'one record';
    return {
      reason: `Higher ${field} likely exists to secure ${meaning.intent}; ${sourceLabel} appears configured for stricter service assumptions.`,
      evidenceFields: [field, 'category', 'applicationNotes'],
      confidence: Math.min(0.95, 0.55 + (higherSpec ? 0.2 : 0.08)),
    };
  });

  const costDrivers = uniqueBy(
    diffFields.map((field) => {
      const meaning = ATTRIBUTE_MEANING[field];
      return {
        driver: `${field}: ${meaning.costDriver}`,
        evidenceFields: [field, 'cost', 'brand'],
        costImpactHint: /high|critical/i.test(meaning.severity) ? 'Potentially high savings if validated' : 'Moderate savings potential',
      };
    }),
    (x) => x.driver,
  );

  const riskFlags = uniqueBy(
    diffFields.map((field) => {
      const meaning = ATTRIBUTE_MEANING[field];
      return {
        risk: meaning.risk,
        severity: meaning.severity,
        evidenceFields: [field, 'standard', 'applicationNotes'],
      };
    }),
    (x) => `${x.risk}-${x.severity}`,
  ).sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity]);

  const validationQuestions = riskFlags.slice(0, 6).map((flag, idx) => ({
    question: `Q${idx + 1}: Is the current duty/environment still compatible if this attribute is reduced?`,
    whyItMatters: `Addresses risk of ${flag.risk}.`,
    decisionImpact: flag.severity === 'Critical' || flag.severity === 'High' ? 'Blocks downgrade if unanswered' : 'Informs pilot scope',
  }));

  const safeSavingsActions = costDrivers.slice(0, 5).map((driver, idx) => {
    const isHigh = /high/i.test(driver.costImpactHint);
    return {
      action: `Standardize on the lower-cost option for ${driver.driver.split(':')[0]} only where application envelope is confirmed equivalent.`,
      conditions: [
        'Use only in assets with matching load/temperature/pressure duty',
        'No stricter certification requirement than selected option',
      ],
      validationSteps: [
        'Confirm spec fit against engineering datasheet',
        'Run controlled field pilot and inspect early-life behavior',
        'Approve through maintenance + compliance governance gate',
      ],
      expectedSavingsHint: isHigh ? 'High savings if approved at scale' : 'Moderate savings through selective standardization',
      effort: isHigh ? 'Medium' : idx % 2 === 0 ? 'Low' : 'Medium',
      rankScore: (isHigh ? 80 : 62) - idx * 6,
    };
  }).sort((a, b) => b.rankScore - a.rankScore);

  const completenessFields = ['standard', 'materialGrade', 'temperatureRange', 'cost', 'brand', 'certification', 'sealType', 'pressureClass', 'precisionClass'];
  const filled = completenessFields.reduce((acc, field) => acc + (normalize(itemA[field]) && normalize(itemB[field]) ? 1 : 0), 0);
  const completeness = filled / completenessFields.length;
  const ruleStrength = Math.min(1, diffFields.length / 6);
  const confidence = Math.max(0.2, Math.min(0.98, 0.45 * completeness + 0.55 * ruleStrength));

  const narrative = `The workflow identified ${costDrivers.length} cost drivers and ${riskFlags.length} risk flags from structured attribute differences. Recommendations prioritize conditional savings actions that preserve compliance and reliability while focusing validation effort on highest-severity gaps.`;

  return {
    specIntentHypotheses: hypotheses,
    costDrivers,
    riskFlags,
    validationQuestions,
    safeSavingsActions: safeSavingsActions.map(({ rankScore, ...rest }) => rest),
    confidence,
    narrative,
  };
}
