const { test } = require('../../../fixtures/auth-fixtures');
const { ApiAssertions } = require('../../../utils/assertions');

test.describe('Health Check API', () => {
  test('should return healthy status', async ({ apiClient }) => {
    const { response, data } = await apiClient.get('/health');

    await ApiAssertions.assertSuccessResponse(response);
    expect(data.status).toBe('healthy');
    expect(data).toHaveProperty('timestamp');
    await ApiAssertions.assertDateFormat(data.timestamp);
  });

  test('should return API version information', async ({ apiClient }) => {
    const { response, data } = await apiClient.get('/health');

    await ApiAssertions.assertSuccessResponse(response);
    expect(data).toHaveProperty('version');
    expect(typeof data.version).toBe('string');
    expect(data.version).toMatch(/^\d+\.\d+\.\d+$/); // Semantic versioning
  });

  test('should return database connection status', async ({ apiClient }) => {
    const { response, data } = await apiClient.get('/health/detailed');

    await ApiAssertions.assertSuccessResponse(response);
    expect(data).toHaveProperty('database');
    expect(data.database.status).toBe('connected');
  });

  test('should return service dependencies status', async ({ apiClient }) => {
    const { response, data } = await apiClient.get('/health/detailed');

    await ApiAssertions.assertSuccessResponse(response);
    expect(data).toHaveProperty('services');
    expect(typeof data.services).toBe('object');
  });

  test('should respond within acceptable time limit', async ({ apiClient }) => {
    const startTime = Date.now();
    const { response } = await apiClient.get('/health');
    const responseTime = Date.now() - startTime;

    await ApiAssertions.assertSuccessResponse(response);
    expect(responseTime).toBeLessThan(500); // Should respond within 500ms
  });

  test('should not require authentication', async ({ apiClient }) => {
    // This test uses unauthenticated client
    const { response, data } = await apiClient.get('/health');

    await ApiAssertions.assertSuccessResponse(response);
    expect(data.status).toBe('healthy');
  });

  test('should handle concurrent health check requests', async ({ apiClient }) => {
    const promises = Array(10).fill().map(() => apiClient.get('/health'));
    const results = await Promise.all(promises);

    results.forEach(async ({ response, data }) => {
      await ApiAssertions.assertSuccessResponse(response);
      expect(data.status).toBe('healthy');
    });
  });
});