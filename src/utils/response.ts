/**
 * Response Utilities
 * Helper functions for creating consistent API responses
 */

import { APIGatewayProxyResult } from 'aws-lambda';

/**
 * Standard API response structure
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Default CORS headers for all responses
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
  'Content-Type': 'application/json',
};

/**
 * Creates a successful response (200 OK)
 */
export function success<T>(data: T, message?: string): APIGatewayProxyResult {
  const body: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

/**
 * Creates a created response (201 Created)
 */
export function created<T>(data: T, message?: string): APIGatewayProxyResult {
  const body: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };

  return {
    statusCode: 201,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

/**
 * Creates a no content response (204 No Content)
 */
export function noContent(): APIGatewayProxyResult {
  return {
    statusCode: 204,
    headers: corsHeaders,
    body: '',
  };
}

/**
 * Creates a bad request response (400 Bad Request)
 */
export function badRequest(error: string): APIGatewayProxyResult {
  const body: ApiResponse<null> = {
    success: false,
    error,
  };

  return {
    statusCode: 400,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

/**
 * Creates a not found response (404 Not Found)
 */
export function notFound(error: string): APIGatewayProxyResult {
  const body: ApiResponse<null> = {
    success: false,
    error,
  };

  return {
    statusCode: 404,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

/**
 * Creates an internal server error response (500 Internal Server Error)
 */
export function serverError(error: string): APIGatewayProxyResult {
  const body: ApiResponse<null> = {
    success: false,
    error,
  };

  return {
    statusCode: 500,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}
