const { expect } = require('@playwright/test');

class ApiAssertions {
  static async assertStatusCode(response, expectedStatus) {
    expect(response.status()).toBe(expectedStatus);
  }

  static async assertSuccessResponse(response) {
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
  }

  static async assertCreatedResponse(response) {
    expect(response.status()).toBe(201);
    expect(response.ok()).toBeTruthy();
  }

  static async assertUnauthorizedResponse(response) {
    expect(response.status()).toBe(401);
  }

  static async assertNotFoundResponse(response) {
    expect(response.status()).toBe(404);
  }

  static async assertBadRequestResponse(response) {
    expect(response.status()).toBe(400);
  }

  static async assertResponseHasProperty(data, property) {
    expect(data).toHaveProperty(property);
  }

  static async assertResponseSchema(data, schema) {
    for (const [key, type] of Object.entries(schema)) {
      expect(data).toHaveProperty(key);
      expect(typeof data[key]).toBe(type);
    }
  }

  static async assertArrayResponse(data, expectedLength = null) {
    expect(Array.isArray(data)).toBeTruthy();
    if (expectedLength !== null) {
      expect(data).toHaveLength(expectedLength);
    }
  }

  static async assertResponseTime(response, maxTime = 2000) {
    const responseTime = response.headers()['x-response-time'] || 
                        new Date().getTime() - response.request().timing().startTime;
    expect(responseTime).toBeLessThan(maxTime);
  }

  static async assertErrorMessage(data, expectedMessage) {
    expect(data).toHaveProperty('error');
    expect(data.error).toContain(expectedMessage);
  }

  static async assertPaginationResponse(data) {
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('pagination');
    expect(data.pagination).toHaveProperty('page');
    expect(data.pagination).toHaveProperty('limit');
    expect(data.pagination).toHaveProperty('total');
  }

  static async assertValidUUID(value) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(value).toMatch(uuidRegex);
  }

  static async assertValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(email).toMatch(emailRegex);
  }

  static async assertDateFormat(dateString) {
    const date = new Date(dateString);
    expect(date).toBeInstanceOf(Date);
    expect(date.toString()).not.toBe('Invalid Date');
  }
}

module.exports = { ApiAssertions };