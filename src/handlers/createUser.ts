/**
 * Create User Handler
 * Creates a new user in the system
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { created, badRequest, serverError } from '../utils/response';
import { userService } from '../services/userService';
import { validateCreateUserInput, safeJsonParse } from '../utils/validation';
import { CreateUserInput } from '../models/user';

/**
 * Create user endpoint handler
 * POST /api/users
 *
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "firstName": "John",
 *   "lastName": "Doe"
 * }
 *
 * Returns the newly created user with generated ID and timestamps
 */
export const handler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    console.log('[CreateUser] Creating new user');

    // Parse the request body
    const body = safeJsonParse<CreateUserInput>(event.body);

    if (!body) {
      console.warn('[CreateUser] Invalid or missing request body');
      return badRequest('Request body must be valid JSON');
    }

    // Validate the input
    const validation = validateCreateUserInput(body);

    if (!validation.isValid) {
      console.warn('[CreateUser] Validation failed:', validation.errors);
      return badRequest(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Check if email already exists
    if (userService.emailExists(body.email)) {
      console.warn(`[CreateUser] Email already exists: ${body.email}`);
      return badRequest('A user with this email already exists');
    }

    // Create the user
    const newUser = userService.createUser({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
    });

    console.log(`[CreateUser] Successfully created user: ${newUser.id}`);

    return created({ user: newUser }, 'User created successfully');
  } catch (error) {
    console.error('[CreateUser] Error creating user:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return serverError(`Failed to create user: ${errorMessage}`);
  }
};
