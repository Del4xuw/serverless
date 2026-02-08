/**
 * Delete User Handler Tests
 */

import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../../src/handlers/deleteUser';
import { userService } from '../../src/services/userService';

// Helper to create mock event with path parameter
const createMockEvent = (userId: string | null): APIGatewayProxyEvent => ({
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: 'DELETE',
  isBase64Encoded: false,
  path: `/api/users/${userId}`,
  pathParameters: userId ? { id: userId } : null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {
    accountId: '123456789012',
    apiId: 'api-id',
    authorizer: null,
    protocol: 'HTTP/1.1',
    httpMethod: 'DELETE',
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: '127.0.0.1',
      user: null,
      userAgent: 'test-agent',
      userArn: null,
    },
    path: `/api/users/${userId}`,
    stage: 'dev',
    requestId: 'test-request-id',
    requestTimeEpoch: Date.now(),
    resourceId: 'resource-id',
    resourcePath: '/api/users/{id}',
  },
  resource: '/api/users/{id}',
});

const mockContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'deleteUser',
  functionVersion: '1',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:deleteUser',
  memoryLimitInMB: '256',
  awsRequestId: 'test-request-id',
  logGroupName: '/aws/lambda/deleteUser',
  logStreamName: '2024/01/01/[$LATEST]abc123',
  getRemainingTimeInMillis: () => 5000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

describe('Delete User Handler', () => {
  beforeEach(() => {
    userService.reset();
  });

  it('should return 204 when user is deleted successfully', async () => {
    const userId = '550e8400-e29b-41d4-a716-446655440001';

    // Verify user exists before deletion
    expect(userService.userExists(userId)).toBe(true);

    const result = await handler(createMockEvent(userId), mockContext);

    expect(result.statusCode).toBe(204);
    expect(result.body).toBe('');

    // Verify user no longer exists
    expect(userService.userExists(userId)).toBe(false);
  });

  it('should return 404 when user not found', async () => {
    const userId = '550e8400-e29b-41d4-a716-446655440099';
    const result = await handler(createMockEvent(userId), mockContext);

    expect(result.statusCode).toBe(404);

    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error).toContain('not found');
  });

  it('should return 400 when user ID is missing', async () => {
    const event = createMockEvent(null);
    event.pathParameters = null;

    const result = await handler(event, mockContext);

    expect(result.statusCode).toBe(400);

    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error).toContain('required');
  });

  it('should return 400 when user ID is invalid UUID', async () => {
    const result = await handler(createMockEvent('not-a-valid-uuid'), mockContext);

    expect(result.statusCode).toBe(400);

    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error).toContain('valid UUID');
  });

  it('should reduce user count after deletion', async () => {
    const initialCount = userService.getUserCount();
    const userId = '550e8400-e29b-41d4-a716-446655440001';

    await handler(createMockEvent(userId), mockContext);

    expect(userService.getUserCount()).toBe(initialCount - 1);
  });

  it('should not affect other users when deleting', async () => {
    const userToDelete = '550e8400-e29b-41d4-a716-446655440001';
    const userToKeep = '550e8400-e29b-41d4-a716-446655440002';

    await handler(createMockEvent(userToDelete), mockContext);

    // Verify the other user still exists
    expect(userService.userExists(userToKeep)).toBe(true);
    expect(userService.getUserById(userToKeep)).not.toBeNull();
  });
});
