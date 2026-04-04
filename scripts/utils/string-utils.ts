/**
 * String Utilities
 * Helper functions for string manipulation
 */

/**
 * Convert kebab-case to PascalCase
 */
export function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  const pascal = kebabToPascal(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to valid TypeScript identifier
 */
export function toIdentifier(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^(\d)/, '_$1')
    .replace(/_+/g, '_');
}

/**
 * Normalize whitespace
 */
export function normalizeWhitespace(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}

