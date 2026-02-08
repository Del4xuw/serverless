/**
 * Get Users Handler Tests
 */

import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../../src/handlers/getUsers';
import { userService } from '../../src/services/userService';

// Mock event
const createMockEvent = (): APIGatewayProxyEvent => ({
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: 'GET',
  isBase64Encoded: false,
  path: '/api/users',
  pathParameters: null,
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
    path: '/api/users',
    stage: 'dev',
    requestId: 'test-request-id',
    requestTimeEpoch: Date.now(),
    resourceId: 'resource-id',
    resourcePath: '/api/users',
  },
  resource: '/api/users',
});

const mockContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'getUsers',
  functionVersion: '1',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:getUsers',
  memoryLimitInMB: '256',
  awsRequestId: 'test-request-id',
  logGroupName: '/aws/lambda/getUsers',
  logStreamName: '2024/01/01/[$LATEST]abc123',
  getRemainingTimeInMillis: () => 5000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

describe('Get Users Handler', () => {
  beforeEach(() => {
    // Reset user service to initial state before each test
    userService.reset();
  });

  it('should return 200 with list of users', async () => {
    const result = await handler(createMockEvent(), mockContext);

    expect(result.statusCode).toBe(200);

    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data.users)).toBe(true);
    expect(body.data.users.length).toBeGreaterThan(0);
    expect(body.data.count).toBe(body.data.users.length);
  });

  it('should return users with correct structure', async () => {
    const result = await handler(createMockEvent(), mockContext);
    const body = JSON.parse(result.body);

    const user = body.data.users[0];
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
  });

  it('should return mock users on initial load', async () => {
    const result = await handler(createMockEvent(), mockContext);
    const body = JSON.parse(result.body);

    // Should have 3 mock users
    expect(body.data.count).toBe(3);

    // Check for known mock user
    const johnDoe = body.data.users.find(
      (u: { email: string }) => u.email === 'john.doe@example.com'
    );
    expect(johnDoe).toBeDefined();
    expect(johnDoe.firstName).toBe('John');
    expect(johnDoe.lastName).toBe('Doe');
  });

  it('should include CORS headers', async () => {
    const result = await handler(createMockEvent(), mockContext);

    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', '*');
    expect(result.headers).toHaveProperty('Content-Type', 'application/json');
  });
});
