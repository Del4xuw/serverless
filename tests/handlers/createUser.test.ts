/**
 * Create User Handler Tests
 */

import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../../src/handlers/createUser';
import { userService } from '../../src/services/userService';

// Helper to create mock event with body
const createMockEvent = (body: object | null): APIGatewayProxyEvent => ({
  body: body ? JSON.stringify(body) : null,
  headers: { 'Content-Type': 'application/json' },
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
  functionName: 'createUser',
  functionVersion: '1',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:createUser',
  memoryLimitInMB: '256',
  awsRequestId: 'test-request-id',
  logGroupName: '/aws/lambda/createUser',
  logStreamName: '2024/01/01/[$LATEST]abc123',
  getRemainingTimeInMillis: () => 5000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

describe('Create User Handler', () => {
  beforeEach(() => {
    userService.reset();
  });

  it('should return 201 when user is created successfully', async () => {
    const newUser = {
      email: 'newuser@example.com',
      firstName: 'New',
      lastName: 'User',
    };

    const result = await handler(createMockEvent(newUser), mockContext);

    expect(result.statusCode).toBe(201);

    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(body.data.user).toBeDefined();
    expect(body.data.user.email).toBe('newuser@example.com');
    expect(body.data.user.firstName).toBe('New');
    expect(body.data.user.lastName).toBe('User');
    expect(body.data.user).toHaveProperty('id');
    expect(body.data.user).toHaveProperty('createdAt');
    expect(body.data.user.email).toHaveProperty('updatedAt');
  });

  it('should return 400 when body is missing', async () => {
    const result = await handler(createMockEvent(null), mockContext);

    expect(result.statusCode).toBe(400);

    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error).toContain('valid JSON');
  });

  it('should return 400 when email is missing', async () => {
    const invalidUser = {
      firstName: 'New',
      lastName: 'User',
    };

    const result = await handler(createMockEvent(invalidUser), mockContext);

    expect(result.statusCode).toBe(400);

    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error).toContain('Email');
  });

  it('should return 400 when email is invalid format', async () => {
    const invalidUser = {
      email: 'not-an-email',
      firstName: 'New',
      lastName: 'User',
    };

    const result = await handler(createMockEvent(invalidUser), mockContext);

    expect(result.statusCode).toBe(400);

    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error).toContain('valid email');
  });

  it('should return 400 when firstName is missing', async () => {
    const invalidUser = {
      email: 'test@example.com',
      lastName: 'User',
    };

    const result = await handler(createMockEvent(invalidUser), mockContext);

    expect(result.statusCode).toBe(400);

    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error).toContain('First name');
  });

  it('should return 400 when lastName is missing', async () => {
    const invalidUser = {
      email: 'test@example.com',
      firstName: 'Test',
    };

    const result = await handler(createMockEvent(invalidUser), mockContext);

    expect(result.statusCode).toBe(400);

    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error).toContain('Last name');
  });

  it('should return 400 when email already exists', async () => {
    const duplicateUser = {
      email: 'john.doe@example.com', // Already exists in mock data
      firstName: 'Another',
      lastName: 'John',
    };

    const result = await handler(createMockEvent(duplicateUser), mockContext);

    expect(result.statusCode).toBe(400);

    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error).toContain('already exists');
  });

  it('should normalize email to lowercase', async () => {
    const newUser = {
      email: 'UPPERCASE@EXAMPLE.COM',
      firstName: 'Test',
      lastName: 'User',
    };

    const result = await handler(createMockEvent(newUser), mockContext);

    expect(result.statusCode).toBe(201);

    const body = JSON.parse(result.body);
    expect(body.data.user.email).toBe('uppercase@example.com');
  });

  it('should trim whitespace from fields', async () => {
    const newUser = {
      email: '  trimmed@example.com  ',
      firstName: '  Trimmed  ',
      lastName: '  User  ',
    };

    const result = await handler(createMockEvent(newUser), mockContext);

    expect(result.statusCode).toBe(201);

    const body = JSON.parse(result.body);
    expect(body.data.user.email).toBe('trimmed@example.com');
    expect(body.data.user.firstName).toBe('Trimmed');
    expect(body.data.user.lastName).toBe('User');
  });
});
