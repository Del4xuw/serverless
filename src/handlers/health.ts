/**
 * Health Check Handler
 * Returns the current status and timestamp of the service
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { success, serverError } from '../utils/response';

/**
 * Health check response structure
 */
interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  service: string;
  version: string;
  environment: string;
  uptime: number;
}

// Track when the Lambda was initialized (cold start time)
const startTime = Date.now();

/**
 * Health check endpoint handler
 * GET /health
 *
 * Returns service health status with metadata
 */
export const handler = async (
  _event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    console.log('[Health] Health check requested');

    const healthResponse: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: process.env.SERVICE_NAME || 'serverless-typescript-api',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'dev',
      uptime: Math.floor((Date.now() - startTime) / 1000), // Uptime in seconds
    };

    console.log('[Health] Service is healthy');

    return success(healthResponse);
  } catch (error) {
    console.error('[Health] Health check failed:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return serverError(`Health check failed: ${errorMessage}`);
  }
};
console.log('Demo for senior');
