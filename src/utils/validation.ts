/**
 * Validation Utilities
 * Helper functions for input validation
 */

/**
 * Validation result structure
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates an email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a UUID format
 */
export function isValidUuid(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Validates that a string is not empty and within length limits
 */
export function isValidString(value: string, minLength = 1, maxLength = 255): boolean {
  return (
    typeof value === 'string' &&
    value.trim().length >= minLength &&
    value.trim().length <= maxLength
  );
}

/**
 * Validates user creation input
 */
export function validateCreateUserInput(input: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof input !== 'object' || input === null) {
    return { isValid: false, errors: ['Request body must be a valid JSON object'] };
  }

  const data = input as Record<string, unknown>;

  // Validate email
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Email must be a valid email address');
  }

  // Validate firstName
  if (!data.firstName || typeof data.firstName !== 'string') {
    errors.push('First name is required');
  } else if (!isValidString(data.firstName, 1, 100)) {
    errors.push('First name must be between 1 and 100 characters');
  }

  // Validate lastName
  if (!data.lastName || typeof data.lastName !== 'string') {
    errors.push('Last name is required');
  } else if (!isValidString(data.lastName, 1, 100)) {
    errors.push('Last name must be between 1 and 100 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Safely parses JSON from a string, returning null if invalid
 */
export function safeJsonParse<T>(json: string | null): T | null {
  if (!json) {
    return null;
  }

  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
