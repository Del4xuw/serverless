/**
 * Get Users Handler
 * Returns a list of all users
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { success, serverError } from '../utils/response';
import { userService } from '../services/userService';

/**
 * Get all users endpoint handler
 * GET /api/users
 *
 * Returns an array of all users in the system
 */
export const handler = async (
  _event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    console.log('[GetUsers] Fetching all users');

    // Get all users from the service
    const users = userService.getAllUsers();

    console.log(`[GetUsers] Successfully retrieved ${users.length} users`);

    return success({
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('[GetUsers] Error fetching users:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return serverError(`Failed to fetch users: ${errorMessage}`);
  }
};
