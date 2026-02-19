import { generateQualification } from './qualificationRules/generateQualification';

export function buildSavingsQualificationWorkflow(itemA, itemB, comparison) {
  return generateQualification(itemA, itemB, comparison);
}
