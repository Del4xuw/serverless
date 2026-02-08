/**
 * Delete User Handler
 * Deletes a user from the system
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { noContent, notFound, badRequest, serverError } from '../utils/response';
import { userService } from '../services/userService';
import { isValidUuid } from '../utils/validation';

/**
 * Delete user endpoint handler
 * DELETE /api/users/{id}
 *
 * Path Parameters:
 * - id: The unique identifier of the user to delete (UUID format)
 *
 * Returns 204 No Content on success, or 404 if user not found
 */
export const handler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    // Extract user ID from path parameters
    const userId = event.pathParameters?.id;

    console.log(`[DeleteUser] Deleting user with ID: ${userId}`);

    // Validate that an ID was provided
    if (!userId) {
      console.warn('[DeleteUser] No user ID provided');
      return badRequest('User ID is required');
    }

    // Validate UUID format
    if (!isValidUuid(userId)) {
      console.warn(`[DeleteUser] Invalid UUID format: ${userId}`);
      return badRequest('User ID must be a valid UUID');
    }

    // Attempt to delete the user
    const deleted = userService.deleteUser(userId);

    // Check if user existed
    if (!deleted) {
      console.warn(`[DeleteUser] User not found: ${userId}`);
      return notFound(`User with ID '${userId}' not found`);
    }

    console.log(`[DeleteUser] Successfully deleted user: ${userId}`);

    // Return 204 No Content on successful deletion
    return noContent();
  } catch (error) {
    console.error('[DeleteUser] Error deleting user:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return serverError(`Failed to delete user: ${errorMessage}`);
  }
};
