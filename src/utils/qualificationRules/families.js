export const FAMILY_PROFILES = {
  fasteners: {
    labels: ['Screws', 'Fasteners (Other)'],
    familyName: 'Fasteners',
    riskContext: 'joint integrity and preload retention',
    validationFocus: 'torque, corrosion class, and fatigue duty',
  },
  bearings: {
    labels: ['Ball Bearings'],
    familyName: 'Bearings',
    riskContext: 'rotating reliability and lubrication stability',
    validationFocus: 'RPM, radial/axial load, lubrication regime, and heat',
  },
  valves: {
    labels: ['Valves'],
    familyName: 'Valves',
    riskContext: 'containment, isolation, and process safety compliance',
    validationFocus: 'media compatibility, leakage class, and pressure-temperature envelope',
  },
  electrical: {
    labels: ['Electric Motors'],
    familyName: 'Electrical',
    riskContext: 'electrical safety, controls compatibility, and uptime',
    validationFocus: 'voltage/frequency, IP protection, hazardous-area and duty cycle',
  },
  sealsConsumables: {
    labels: ['Gaskets', 'Seals'],
    familyName: 'Consumables / Seals',
    riskContext: 'leak prevention and contamination control',
    validationFocus: 'media, temperature, compression behavior, and service interval',
  },
  fittings: {
    labels: ['Hydraulic Fittings'],
    familyName: 'Hydraulic / Pneumatic Fittings',
    riskContext: 'pressure boundary safety and leak-tightness',
    validationFocus: 'thread standard, pressure class, seal compatibility, and pulsation duty',
  },
  couplings: {
    labels: ['Couplings'],
    familyName: 'Couplings',
    riskContext: 'power transmission and alignment reliability',
    validationFocus: 'torque peaks, misalignment tolerance, and insert wear behavior',
  },
  bushings: {
    labels: ['Bushings'],
    familyName: 'Bushings',
    riskContext: 'wear life and fit clearance control',
    validationFocus: 'clearance fit, lubrication state, and shaft/housing wear',
  },
  toolsSpare: {
    labels: [],
    familyName: 'Tools / Spare Parts',
    riskContext: 'general reliability and replacement continuity',
    validationFocus: 'fit, compatibility, and maintenance instructions',
  },
};

const lower = (s) => (s || '').toString().trim().toLowerCase();

export const resolveFamilyProfile = (category) => {
  const key = Object.keys(FAMILY_PROFILES).find((k) =>
    FAMILY_PROFILES[k].labels.some((label) => lower(label) === lower(category)),
  );
  return FAMILY_PROFILES[key || 'toolsSpare'];
};
