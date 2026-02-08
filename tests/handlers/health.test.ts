/**
 * Health Handler Tests
 */

import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../../src/handlers/health';

// Mock event and context
const mockEvent: APIGatewayProxyEvent = {
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: 'GET',
  isBase64Encoded: false,
  path: '/health',
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
    path: '/health',
    stage: 'dev',
    requestId: 'test-request-id',
    requestTimeEpoch: Date.now(),
    resourceId: 'resource-id',
    resourcePath: '/health',
  },
  resource: '/health',
};

const mockContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'health',
  functionVersion: '1',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:health',
  memoryLimitInMB: '256',
  awsRequestId: 'test-request-id',
  logGroupName: '/aws/lambda/health',
  logStreamName: '2024/01/01/[$LATEST]abc123',
  getRemainingTimeInMillis: () => 5000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

describe('Health Handler', () => {
  beforeEach(() => {
    // Set environment variables for tests
    process.env.SERVICE_NAME = 'serverless-typescript-api';
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    delete process.env.SERVICE_NAME;
    delete process.env.NODE_ENV;
  });

  it('should return 200 with healthy status', async () => {
    const result = await handler(mockEvent, mockContext);

    expect(result.statusCode).toBe(200);
    expect(result.headers).toHaveProperty('Content-Type', 'application/json');
    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', '*');

    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('healthy');
    expect(body.data.service).toBe('serverless-typescript-api');
    expect(body.data.environment).toBe('test');
    expect(body.data.version).toBe('1.0.0');
    expect(body.data).toHaveProperty('timestamp');
    expect(body.data).toHaveProperty('uptime');
  });

  it('should include a valid ISO timestamp', async () => {
    const result = await handler(mockEvent, mockContext);
    const body = JSON.parse(result.body);

    const timestamp = new Date(body.data.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(isNaN(timestamp.getTime())).toBe(false);
  });

  it('should return uptime as a number', async () => {
    const result = await handler(mockEvent, mockContext);
    const body = JSON.parse(result.body);

    expect(typeof body.data.uptime).toBe('number');
    expect(body.data.uptime).toBeGreaterThanOrEqual(0);
  });

  it('should use default service name if not set', async () => {
    delete process.env.SERVICE_NAME;

    const result = await handler(mockEvent, mockContext);
    const body = JSON.parse(result.body);

    expect(body.data.service).toBe('serverless-typescript-api');
  });
});
