/**
 * Get User Handler
 * Returns a single user by ID
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { success, notFound, badRequest, serverError } from '../utils/response';
import { userService } from '../services/userService';
import { isValidUuid } from '../utils/validation';

/**
 * Get single user endpoint handler
 * GET /api/users/{id}
 *
 * Path Parameters:
 * - id: The unique identifier of the user (UUID format)
 *
 * Returns the user if found, or a 404 error if not found
 */
export const handler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    // Extract user ID from path parameters
    const userId = event.pathParameters?.id;

    console.log(`[GetUser] Fetching user with ID: ${userId}`);

    // Validate that an ID was provided
    if (!userId) {
      console.warn('[GetUser] No user ID provided');
      return badRequest('User ID is required');
    }

    // Validate UUID format
    if (!isValidUuid(userId)) {
      console.warn(`[GetUser] Invalid UUID format: ${userId}`);
      return badRequest('User ID must be a valid UUID');
    }

    // Fetch the user from the service
    const user = userService.getUserById(userId);

    // Check if user exists
    if (!user) {
      console.warn(`[GetUser] User not found: ${userId}`);
      return notFound(`User with ID '${userId}' not found`);
    }

    console.log(`[GetUser] Successfully retrieved user: ${userId}`);

    return success({ user });
  } catch (error) {
    console.error('[GetUser] Error fetching user:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return serverError(`Failed to fetch user: ${errorMessage}`);
  }
};
