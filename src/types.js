/**
 * @typedef {'Applied' | 'Screening' | 'Interview 1' | 'Case Study' | 'Final Interview' | 'Offer' | 'Rejected'} Stage
 * @typedef {'Referral' | 'Direct Outreach' | 'LinkedIn' | 'Company Website'} Method
 */

/**
 * @typedef {Object} JobApplication
 * @property {string} id - Unique identifier
 * @property {string} company - Company name
 * @property {string} role - Position/Role
 * @property {string} applicationDate - ISO date string
 * @property {Method} method - Application method
 * @property {Stage} stage - Current stage
 * @property {number} priority - Priority from 1-10
 * @property {string} nextAction - Next action to take
 * @property {string|null} nextActionDeadline - ISO date string for deadline
 * @property {string} salaryRange - Salary range (optional)
 * @property {string} notes - Additional notes
 * @property {string} jobDescriptionUrl - URL to job description
 * @property {string} createdAt - ISO date string when created
 * @property {string} updatedAt - ISO date string when last updated
 */

export const STAGES = [
  'Applied',
  'Screening',
  'Interview 1',
  'Case Study',
  'Final Interview',
  'Offer',
  'Rejected'
];

export const METHODS = [
  'Referral',
  'Direct Outreach',
  'LinkedIn',
  'Company Website'
];

export const PRIORITY_COLORS = {
  high: { min: 8, max: 10, color: 'bg-red-100 border-red-300 text-red-800' },
  medium: { min: 4, max: 7, color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  low: { min: 1, max: 3, color: 'bg-green-100 border-green-300 text-green-800' }
};

export const getPriorityColor = (priority) => {
  if (priority >= 8) return PRIORITY_COLORS.high.color;
  if (priority >= 4) return PRIORITY_COLORS.medium.color;
  return PRIORITY_COLORS.low.color;
};

export const getPriorityLabel = (priority) => {
  if (priority >= 8) return 'High';
  if (priority >= 4) return 'Medium';
  return 'Low';
};
