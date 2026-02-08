/**
 * Get User Handler Tests
 */

import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../../src/handlers/getUser';
import { userService } from '../../src/services/userService';

// Helper to create mock event with path parameter
const createMockEvent = (userId: string | null): APIGatewayProxyEvent => ({
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: 'GET',
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
    httpMethod: 'GET',
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
  functionName: 'getUser',
  functionVersion: '1',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:getUser',
  memoryLimitInMB: '256',
  awsRequestId: 'test-request-id',
  logGroupName: '/aws/lambda/getUser',
  logStreamName: '2024/01/01/[$LATEST]abc123',
  getRemainingTimeInMillis: () => 5000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

describe('Get User Handler', () => {
  beforeEach(() => {
    userService.reset();
  });

  it('should return 200 with user when found', async () => {
    const userId = '550e8400-e29b-41d4-a716-446655440001';
    const result = await handler(createMockEvent(userId), mockContext);

    expect(result.statusCode).toBe(200);

    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(body.data.user).toBeDefined();
    expect(body.data.user.id).toBe(userId);
    expect(body.data.user.email).toBe('john.doe@example.com');
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
    const result = await handler(createMockEvent('invalid-uuid'), mockContext);

    expect(result.statusCode).toBe(400);

    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error).toContain('valid UUID');
  });

  it('should return user with correct structure', async () => {
    const userId = '550e8400-e29b-41d4-a716-446655440001';
    const result = await handler(createMockEvent(userId), mockContext);
    const body = JSON.parse(result.body);

    const user = body.data.user;
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
  });
});
