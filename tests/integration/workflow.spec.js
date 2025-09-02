const { test } = require('../../../fixtures/auth-fixtures');
const { ApiAssertions } = require('../../../utils/assertions');
const { TestDataGenerator } = require('../../../utils/test-data');

test.describe('Authentication - Login', () => {
  test('should login with valid credentials', async ({ apiClient }) => {
    const credentials = {
      email: 'admin@test.com',
      password: 'admin123'
    };

    const { response, data } = await apiClient.post('/auth/login', credentials);

    await ApiAssertions.assertSuccessResponse(response);
    await ApiAssertions.assertResponseHasProperty(data, 'token');
    await ApiAssertions.assertResponseHasProperty(data, 'user');
    await ApiAssertions.assertValidEmail(data.user.email);
    expect(data.user.email).toBe(credentials.email);
  });

  test('should return 401 for invalid credentials', async ({ apiClient }) => {
    const invalidCredentials = {
      email: 'invalid@test.com',
      password: 'wrongpassword'
    };

    const { response, data } = await apiClient.post('/auth/login', invalidCredentials);

    await ApiAssertions.assertUnauthorizedResponse(response);
    await ApiAssertions.assertErrorMessage(data, 'Invalid credentials');
  });

  test('should return 400 for missing email', async ({ apiClient }) => {
    const incompleteCredentials = {
      password: 'password123'
    };

    const { response, data } = await apiClient.post('/auth/login', incompleteCredentials);

    await ApiAssertions.assertBadRequestResponse(response);
    await ApiAssertions.assertErrorMessage(data, 'Email is required');
  });

  test('should return 400 for missing password', async ({ apiClient }) => {
    const incompleteCredentials = {
      email: 'test@example.com'
    };

    const { response, data } = await apiClient.post('/auth/login', incompleteCredentials);

    await ApiAssertions.assertBadRequestResponse(response);
    await ApiAssertions.assertErrorMessage(data, 'Password is required');
  });

  test('should return 400 for malformed email', async ({ apiClient }) => {
    const invalidCredentials = {
      email: 'not-an-email',
      password: 'password123'
    };

    const { response, data } = await apiClient.post('/auth/login', invalidCredentials);

    await ApiAssertions.assertBadRequestResponse(response);
    await ApiAssertions.assertErrorMessage(data, 'Invalid email format');
  });

  test('should handle concurrent login requests', async ({ apiClient }) => {
    const credentials = {
      email: 'admin@test.com',
      password: 'admin123'
    };

    const promises = Array(5).fill().map(() => 
      apiClient.post('/auth/login', credentials)
    );

    const results = await Promise.all(promises);

    results.forEach(async ({ response, data }) => {
      await ApiAssertions.assertSuccessResponse(response);
      await ApiAssertions.assertResponseHasProperty(data, 'token');
    });
  });

  test('should return different tokens for multiple logins', async ({ apiClient }) => {
    const credentials = {
      email: 'admin@test.com',
      password: 'admin123'
    };

    const { data: firstLogin } = await apiClient.post('/auth/login', credentials);
    const { data: secondLogin } = await apiClient.post('/auth/login', credentials);

    expect(firstLogin.token).not.toBe(secondLogin.token);
  });
});