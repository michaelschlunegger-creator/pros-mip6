const mkQuestion = (question, whyItMatters, whatToCheck, riskIfWrong) => ({ question, whyItMatters, whatToCheck, riskIfWrong });

export const ATTRIBUTE_RULES = {
  coating: {
    intent: 'corrosion, friction, or chemical-exposure protection',
    savingsHypothesis: 'Coating upgrades often add avoidable cost if exposure is mild.',
    questionTemplates: ({ family }) => [
      mkQuestion(
        `Is the ${family.familyName} installed in corrosive, washdown, or chemical-exposed zones that require this coating class?`,
        'Coating is frequently the hidden premium for durability assurance.',
        'Review environment code, chemical contact, humidity/salt exposure, and cleaning agents.',
        'Premature corrosion, seizure, or frequent replacement can erase savings.'
      ),
      mkQuestion(
        'Can a lower coating class still meet target service interval under current maintenance practice?',
        'Savings are safe only if interval and rework rates remain stable.',
        'Compare service-life history for coated vs baseline finish parts.',
        'Downtime and warranty claims may increase due to early surface failure.'
      ),
    ],
  },
  materialGrade: {
    intent: 'strength margin and fatigue resistance',
    savingsHypothesis: 'Higher grades increase unit price and may be over-specified in low-stress duty.',
    questionTemplates: ({ family }) => [
      mkQuestion(
        `What is the actual peak operating load versus allowable load for the current ${family.familyName.toLowerCase()} grade?`,
        'Grade differences directly change structural safety margin.',
        'Use design load case + transient peaks + safety factor policy.',
        'Underspecification can cause structural failure or safety incidents.'
      ),
      mkQuestion(
        'Is there documented fatigue or shock loading that justifies keeping the higher grade?',
        'Fatigue duty can require premium grade even with moderate average load.',
        'Check failure history, duty cycle, shock events, and vibration data.',
        'Crack initiation and field failures can rise after downgrade.'
      ),
    ],
  },
  loadRating: {
    intent: 'mechanical capacity and life margin',
    savingsHypothesis: 'Capacity upgrades increase price and may exceed real operating demand.',
    questionTemplates: ({ family }) => [
      mkQuestion(
        `Do measured ${family.validationFocus} conditions stay below the lower load rating with required safety margin?`,
        'Load class is a primary cost and reliability lever.',
        'Validate peak/continuous load and startup/shock loads.',
        'Overload can trigger accelerated wear or catastrophic failure.'
      ),
    ],
  },
  pressureRating: {
    intent: 'pressure containment and safety compliance',
    savingsHypothesis: 'Higher pressure classes can be costly if process pressure is consistently lower.',
    questionTemplates: ({ family }) => [
      mkQuestion(
        'Is maximum operating and surge pressure within the lower rating after adding policy safety margin?',
        'Pressure class drives both material and compliance cost.',
        'Use process historian data and surge/transient records.',
        'Leak, burst, or unplanned shutdown risk increases if wrong.'
      ),
      mkQuestion(
        'Does site code or customer specification mandate the current pressure class regardless of measured pressure?',
        'Contractual constraints can block technical downgrades.',
        'Review project spec, code class, and insurance requirements.',
        'Non-compliance can invalidate acceptance or certifications.'
      ),
    ],
  },
  pressureClass: {
    intent: 'process pressure envelope and safety margin',
    savingsHypothesis: 'Pressure-class reduction may cut cost if process envelope is over-conservative.',
    questionTemplates: ({ family }) => [
      mkQuestion(
        `For this ${family.familyName.toLowerCase()} application, is pressure class selected by real process need or legacy standard?`,
        'Legacy pressure choices are common cost inflation sources.',
        'Compare current process envelope to original design basis.',
        'Mismatch can compromise containment safety.'
      ),
    ],
  },
  standard: {
    intent: 'interchangeability and compliance alignment',
    savingsHypothesis: 'Standard harmonization reduces duplicate SKUs and procurement complexity.',
    questionTemplates: ({ family }) => [
      mkQuestion(
        `Will switching standards preserve physical and functional interchangeability across ${family.familyName.toLowerCase()} installations?`,
        'Standard differences can hide fit and compliance breaks.',
        'Check interfaces, dimensions, and mating component standards.',
        'Wrong standard can cause installation failure and rework.'
      ),
    ],
  },
  certification: {
    intent: 'regulatory/legal qualification',
    savingsHypothesis: 'Certification premiums may be avoidable where regulated scope does not apply.',
    questionTemplates: ({ family }) => [
      mkQuestion(
        `Is this ${family.familyName.toLowerCase()} installed in an area/process that legally requires the higher certification?`,
        'Certifications can be mandatory in specific zones only.',
        'Map asset location, process class, and audit requirement matrix.',
        'Using uncertified parts where required can be non-compliant.'
      ),
      mkQuestion(
        'Do customer, insurer, or internal standards require retaining certification even in low-risk service?',
        'Commercial and governance rules can supersede technical equivalence.',
        'Review QA contracts, insurer clauses, and governance policies.',
        'Approval delays or legal issues can negate savings.'
      ),
    ],
  },
  tolerance: {
    intent: 'fit precision and performance stability',
    savingsHypothesis: 'Tight tolerances increase machining cost and lead time.',
    questionTemplates: ({ family }) => [
      mkQuestion(
        `Does this ${family.familyName.toLowerCase()} truly need the tighter tolerance for performance or leak control?`,
        'Tolerance is often over-tightened to hedge unknowns.',
        'Compare field performance against looser tolerance alternatives.',
        'Excess play, vibration, or leak risk can rise if too loose.'
      ),
    ],
  },
  precisionClass: {
    intent: 'efficiency, vibration, and quality performance',
    savingsHypothesis: 'Higher precision classes add premium cost and may exceed duty needs.',
    questionTemplates: ({ family }) => [
      mkQuestion(
        `Are current performance KPIs (vibration/noise/efficiency) dependent on this precision class in ${family.familyName.toLowerCase()} service?`,
        'Precision class affects both performance and lifecycle behavior.',
        'Use condition-monitoring data and acceptance limits.',
        'Downgrade may increase failures or quality drift.'
      ),
    ],
  },
  temperatureRange: {
    intent: 'thermal envelope and material stability',
    savingsHypothesis: 'Wide thermal ranges add cost via premium materials or elastomers.',
    questionTemplates: ({ family }) => [
      mkQuestion(
        `Do real ambient/process temperatures ever approach the higher ${family.familyName.toLowerCase()} temperature limit?`,
        'Thermal headroom is expensive but sometimes unnecessary.',
        'Review seasonal peaks, process excursions, and startup temperatures.',
        'Seal degradation or thermal failure may occur if limit is exceeded.'
      ),
    ],
  },
  sealType: {
    intent: 'leak-tightness and contamination barrier performance',
    savingsHypothesis: 'Premium seal technologies can often be right-sized to media and duty.',
    questionTemplates: ({ family }) => [
      mkQuestion(
        `Is the selected seal type required for media compatibility in this ${family.familyName.toLowerCase()} duty?`,
        'Seal chemistry mismatch is a common hidden risk.',
        'Check media list, pressure pulses, and contamination tolerance.',
        'Wrong seal may leak, swell, harden, or fail early.'
      ),
      mkQuestion(
        'Can a lower-cost seal design maintain leak class and maintenance interval targets?',
        'Savings only hold if leak rate and replacement frequency stay acceptable.',
        'Verify leak test history and PM replacement intervals.',
        'Higher leak incidents can increase HSE and downtime cost.'
      ),
    ],
  },
  ipRating: {
    intent: 'ingress protection against dust/water',
    savingsHypothesis: 'Higher IP ratings increase enclosure and component cost.',
    questionTemplates: ({ family }) => [
      mkQuestion(
        `Is the installed environment severe enough to require the higher IP rating for this ${family.familyName.toLowerCase()} item?`,
        'IP over-spec is common where enclosure conditions improved over time.',
        'Review washdown, dust class, and outdoor exposure records.',
        'Ingress can cause short circuits, corrosion, or sudden failure.'
      ),
    ],
  },
  hazardousArea: {
    intent: 'explosive atmosphere safety compliance',
    savingsHypothesis: 'Hazard-rated components carry significant premium where not mandated.',
    questionTemplates: ({ family }) => [
      mkQuestion(
        `Is this asset physically located in a hazardous zone that mandates the current hazardous-area rating?`,
        'Hazard zoning is a hard compliance boundary.',
        'Verify zone classification drawings and permit-to-work scope.',
        'Misclassification can create severe safety and legal risk.'
      ),
    ],
  },
  size: {
    intent: 'physical envelope and interface compatibility',
    savingsHypothesis: 'Larger frame/size variants raise material and transport costs.',
    questionTemplates: ({ family }) => [
      mkQuestion(
        `Can the lower-cost size variant fit all target ${family.familyName.toLowerCase()} interfaces without adapter rework?`,
        'Size mismatch drives installation delay and hidden labor cost.',
        'Check mounting pattern, clearances, and connected component limits.',
        'Bad fit can trigger rework and outage extension.'
      ),
    ],
  },
  diameter: {
    intent: 'fit and flow/load interface',
    savingsHypothesis: 'Diameter class can be rationalized where interface constraints permit.',
    questionTemplates: ({ family }) => [
      mkQuestion(
        `Does the alternate diameter preserve required fit/performance in this ${family.familyName.toLowerCase()} application?`,
        'Diameter changes alter fit, load path, or flow profile.',
        'Validate interface dimensions and performance calculations.',
        'Incorrect sizing causes leaks, vibration, or mechanical stress.'
      ),
    ],
  },
  brand: {
    intent: 'supplier quality consistency and support',
    savingsHypothesis: 'Brand premium may be reduced with validated equivalent suppliers.',
    questionTemplates: ({ family }) => [
      mkQuestion(
        `Is there evidence that a lower-cost supplier meets quality and reliability requirements for ${family.familyName.toLowerCase()} use?`,
        'Supplier changes can affect quality escape risk and lead time reliability.',
        'Review COA/PPAP, failure history, and on-time performance.',
        'Quality drift can drive warranty, rework, and downtime costs.'
      ),
    ],
  },
};

export const DEFAULT_ATTRIBUTE_RULE = {
  intent: 'functional suitability and lifecycle reliability',
  savingsHypothesis: 'Normalization may reduce cost if service requirements are still met.',
  questionTemplates: ({ attribute, family }) => [
    mkQuestion(
      `What evidence confirms a lower-cost option for ${attribute} still fits ${family.familyName.toLowerCase()} duty?`,
      'Unknown attribute deltas still require bounded validation.',
      'Review datasheets, field history, and engineering constraints.',
      'Unvalidated substitutions can increase failure and compliance risk.'
    ),
  ],
};
