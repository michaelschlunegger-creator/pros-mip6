export const normalize = (value) => (value ?? '').toString().trim();
export const lower = (value) => normalize(value).toLowerCase();

export const uniqueBy = (arr, keyFn) => {
  const seen = new Set();
  return arr.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const severityWeights = { Low: 25, Medium: 45, High: 70, Critical: 90 };

export const rankRisk = (riskFlags) =>
  [...riskFlags].sort((a, b) => (severityWeights[b.severity] ?? 40) - (severityWeights[a.severity] ?? 40));

export const inferNumeric = (value) => {
  const match = normalize(value).match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
};

export const inferDifferenceStrength = (a, b) => {
  const aa = lower(a);
  const bb = lower(b);
  if (!aa && !bb) return 0;
  if (aa === bb) return 0;
  const na = inferNumeric(a);
  const nb = inferNumeric(b);
  if (na !== null && nb !== null) {
    const denom = Math.max(Math.abs(na), Math.abs(nb), 1);
    return Math.min(1, Math.abs(na - nb) / denom);
  }
  return 0.55;
};

export const confidenceToLevel = (confidence) => (confidence >= 0.75 ? 'High' : confidence >= 0.5 ? 'Medium' : 'Low');
