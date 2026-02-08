/**
 * User Model
 * Defines the structure of a User and related types
 */

/**
 * Represents a user in the system
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input for creating a new user (without auto-generated fields)
 */
export interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Input for updating an existing user (all fields optional)
 */
export interface UpdateUserInput {
  email?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Type guard to check if an object is a valid CreateUserInput
 */
export function isCreateUserInput(obj: unknown): obj is CreateUserInput {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const input = obj as Record<string, unknown>;

  return (
    typeof input.email === 'string' &&
    typeof input.firstName === 'string' &&
    typeof input.lastName === 'string'
  );
}
