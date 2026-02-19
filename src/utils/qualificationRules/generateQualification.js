import { ATTRIBUTE_RULES, DEFAULT_ATTRIBUTE_RULE } from './attributes';
import { resolveFamilyProfile } from './families';
import { inferDifferenceStrength, lower, normalize, rankRisk, uniqueBy } from './helpers';

const severityByAttr = {
  hazardousArea: 'Critical',
  certification: 'High',
  pressureRating: 'High',
  pressureClass: 'High',
  materialGrade: 'High',
  loadRating: 'High',
  standard: 'High',
  ipRating: 'High',
  sealType: 'High',
  temperatureRange: 'High',
  tolerance: 'Medium',
  precisionClass: 'Medium',
  coating: 'Medium',
  brand: 'Medium',
  diameter: 'High',
  size: 'High',
  length: 'Medium',
};

const candidateAttributes = [
  'coating', 'materialGrade', 'loadRating', 'pressureRating', 'pressureClass',
  'standard', 'certification', 'tolerance', 'precisionClass', 'diameter', 'length', 'size',
  'temperatureRange', 'sealType', 'brand', 'ipRating', 'hazardousArea',
];

const makeDriver = (attribute, itemA, itemB, family) => {
  const rule = ATTRIBUTE_RULES[attribute] || DEFAULT_ATTRIBUTE_RULE;
  const a = itemA[attribute];
  const b = itemB[attribute];
  const strength = inferDifferenceStrength(a, b);
  const savingsHypothesis = `${rule.savingsHypothesis} Difference observed: ${normalize(a) || 'N/A'} vs ${normalize(b) || 'N/A'}.`;

  return {
    driverKey: attribute,
    driver: `${attribute}: ${(rule.costDriverLogic || rule.intent)}`,
    intent: rule.intent,
    savingsHypothesis,
    evidenceFields: [attribute, 'cost', 'applicationNotes', family.validationFocus],
    rankScore: Math.round(55 + strength * 35),
  };
};

const makeRiskFlag = (attribute, itemA, itemB, family) => {
  const rule = ATTRIBUTE_RULES[attribute] || DEFAULT_ATTRIBUTE_RULE;
  return {
    attribute,
    risk: `${rule.intent} risk in ${family.familyName.toLowerCase()} context if changed without validation.`,
    severity: severityByAttr[attribute] || 'Medium',
    evidenceFields: [attribute, 'standard', 'applicationNotes', family.riskContext],
  };
};

const buildQuestionsForAttribute = (attribute, family) => {
  const rule = ATTRIBUTE_RULES[attribute] || DEFAULT_ATTRIBUTE_RULE;
  const templates = rule.questionTemplates({ attribute, family });
  return templates.map((q, index) => ({
    id: `${attribute}-${index}`,
    driverKey: attribute,
    question: q.question,
    whyItMatters: q.whyItMatters,
    whatToCheck: q.whatToCheck,
    riskIfWrong: q.riskIfWrong,
    dedupeKey: `${attribute}-${lower(q.question)}`,
  }));
};

export function generateQualification(itemA, itemB, comparison) {
  const family = resolveFamilyProfile(itemA.category);
  const differentAttributes = candidateAttributes.filter((attr) => lower(itemA[attr]) !== lower(itemB[attr]));

  const specIntentHypotheses = differentAttributes.map((attribute) => {
    const rule = ATTRIBUTE_RULES[attribute] || DEFAULT_ATTRIBUTE_RULE;
    return {
      reason: `${attribute} likely reflects ${rule.intent} requirements in ${family.familyName.toLowerCase()} service.`,
      evidenceFields: [attribute, 'category', 'applicationNotes'],
      confidence: Math.min(0.95, 0.58 + inferDifferenceStrength(itemA[attribute], itemB[attribute]) * 0.32),
    };
  });

  const costDrivers = differentAttributes.map((attr) => makeDriver(attr, itemA, itemB, family))
    .sort((a, b) => b.rankScore - a.rankScore);

  const riskFlags = rankRisk(differentAttributes.map((attr) => makeRiskFlag(attr, itemA, itemB, family)));

  const validationQuestions = uniqueBy(
    differentAttributes.flatMap((attr) => buildQuestionsForAttribute(attr, family)),
    (q) => q.dedupeKey,
  ).slice(0, 6);

  const safeSavingsActions = costDrivers.slice(0, 5).map((driver, idx) => ({
    action: `Evaluate a lower-cost alternative for ${driver.driverKey} only where validation answers remain green for ${family.familyName.toLowerCase()} assets.`,
    relatedDrivers: [driver.driverKey],
    conditions: [
      `Only apply where ${family.validationFocus} is confirmed equivalent.`,
      'Do not apply if compliance/certification requirements become stricter.',
    ],
    validationSteps: [
      `Answer driver-specific questions for ${driver.driverKey}.`,
      'Run one controlled pilot and inspect reliability/compliance outcomes.',
      'Approve through engineering + maintenance governance workflow.',
    ],
    expectedSavingsHint: driver.rankScore >= 75 ? 'High savings potential after validation' : 'Moderate savings potential with selective rollout',
    effort: driver.rankScore >= 75 ? 'Medium' : idx % 2 === 0 ? 'Low' : 'Medium',
  }));

  const completenessFields = ['standard', 'materialGrade', 'temperatureRange', 'cost', 'brand', 'certification', 'sealType', 'pressureClass', 'precisionClass', 'ipRating', 'hazardousArea'];
  const filled = completenessFields.reduce((sum, field) => sum + (normalize(itemA[field]) && normalize(itemB[field]) ? 1 : 0), 0);
  const completeness = filled / completenessFields.length;
  const ruleStrength = Math.min(1, differentAttributes.length / 7);
  const confidence = Math.max(0.25, Math.min(0.98, 0.45 * completeness + 0.55 * ruleStrength));

  const narrative = `Generated ${validationQuestions.length} unique attribute-aware questions across ${differentAttributes.length || 1} key drivers for ${family.familyName}. Prioritized actions emphasize ${family.validationFocus} while protecting ${family.riskContext}.`;

  return {
    family: family.familyName,
    specIntentHypotheses,
    costDrivers,
    riskFlags,
    validationQuestions,
    safeSavingsActions,
    confidence,
    narrative,
  };
}
