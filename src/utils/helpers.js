/**
 * Utility functions for common operations
 */

/**
 * Clean and normalize exam names for routing
 * @param {string} examName - The exam name to clean
 * @returns {string} - Cleaned exam name
 */
export const cleanExamName = (examName) => {
  return examName?.toLowerCase().replace(/\s+/g, '');
};

/**
 * Format phone number for display
 * @param {string} number - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (number) => {
  if (!number) return '';
  return number.replace(/(\d{2})(\d{3})(\d{2})(\d{3})/, '+91 $1$2 $3$4');
};

/**
 * Generate gradient text classes for Tailwind
 * @param {string} fromColor - Starting color
 * @param {string} toColor - Ending color
 * @returns {string} - Tailwind classes
 */
export const getGradientTextClasses = (fromColor, toColor) => {
  return `bg-gradient-to-b from-[${fromColor}] to-[${toColor}] bg-clip-text text-transparent`;
};

/**
 * Validate required props
 * @param {Object} props - Props object
 * @param {Array} requiredProps - Array of required prop names
 * @returns {boolean} - Whether all required props are present
 */
export const validateProps = (props, requiredProps) => {
  return requiredProps.every(prop => props[prop] !== undefined && props[prop] !== null);
};