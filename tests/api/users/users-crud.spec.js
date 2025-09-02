const { test } = require('../../../fixtures/auth-fixtures');
const { ApiAssertions } = require('../../../utils/assertions');
const { TestDataGenerator } = require('../../../utils/test-data');

test.describe('Users CRUD Operations', () => {
  let createdUserId;

  test('should create a new user', async ({ authenticatedClient }) => {
    const userData = TestDataGenerator.generateUser();

    const { response, data } = await authenticatedClient.post('/users', userData);

    await ApiAssertions.assertCreatedResponse(response);
    await ApiAssertions.assertResponseHasProperty(data, 'id');
    await ApiAssertions.assertResponseHasProperty(data, 'name');
    await ApiAssertions.assertResponseHasProperty(data, 'email');
    await ApiAssertions.assertValidUUID(data.id);
    await ApiAssertions.assertValidEmail(data.email);
    
    expect(data.name).toBe(userData.name);
    expect(data.email).toBe(userData.email);
    
    createdUserId = data.id;
  });

  test('should retrieve all users', async ({ authenticatedClient }) => {
    const { response, data } = await authenticatedClient.get('/users');

    await ApiAssertions.assertSuccessResponse(response);
    await ApiAssertions.assertArrayResponse(data);
    
    if (data.length > 0) {
      await ApiAssertions.assertResponseSchema(data[0], {
        id: 'string',
        name: 'string',
        email: 'string'
      });
    }
  });

  test('should retrieve users with pagination', async ({ authenticatedClient }) => {
    const { response, data } = await authenticatedClient.get('/users?page=1&limit=10');

    await ApiAssertions.assertSuccessResponse(response);
    await ApiAssertions.assertPaginationResponse(data);
    expect(data.data.length).toBeLessThanOrEqual(10);
  });

  test('should retrieve a specific user by ID', async ({ authenticatedClient }) => {
    // First create a user
    const userData = TestDataGenerator.generateUser();
    const { data: createdUser } = await authenticatedClient.post('/users', userData);

    // Then retrieve it
    const { response, data } = await authenticatedClient.get(`/users/${createdUser.id}`);

    await ApiAssertions.assertSuccessResponse(response);
    await ApiAssertions.assertResponseSchema(data, {
      id: 'string',
      name: 'string',
      email: 'string'
    });
    expect(data.id).toBe(createdUser.id);
    expect(data.email).toBe(userData.email);
  });

  test('should return 404 for non-existent user', async ({ authenticatedClient }) => {
    const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
    
    const { response } = await authenticatedClient.get(`/users/${nonExistentId}`);

    await ApiAssertions.assertNotFoundResponse(response);
  });

  test('should update a user', async ({ authenticatedClient }) => {
    // Create user first
    const userData = TestDataGenerator.generateUser();
    const { data: createdUser } = await authenticatedClient.post('/users', userData);

    // Update user
    const updatedData = {
      name: 'Updated Name',
      email: TestDataGenerator.randomEmail()
    };

    const { response, data } = await authenticatedClient.put(`/users/${createdUser.id}`, updatedData);

    await ApiAssertions.assertSuccessResponse(response);
    expect(data.name).toBe(updatedData.name);
    expect(data.email).toBe(updatedData.email);
    expect(data.id).toBe(createdUser.id);
  });

  test('should partially update a user', async ({ authenticatedClient }) => {
    // Create user first
    const userData = TestDataGenerator.generateUser();
    const { data: createdUser } = await authenticatedClient.post('/users', userData);

    // Partial update
    const partialUpdate = {
      name: 'Partially Updated Name'
    };

    const { response, data } = await authenticatedClient.patch(`/users/${createdUser.id}`, partialUpdate);

    await ApiAssertions.assertSuccessResponse(response);
    expect(data.name).toBe(partialUpdate.name);
    expect(data.email).toBe(userData.email); // Should remain unchanged
  });

  test('should delete a user', async ({ authenticatedClient }) => {
    // Create user first
    const userData = TestDataGenerator.generateUser();
    const { data: createdUser } = await authenticatedClient.post('/users', userData);

    // Delete user
    const { response } = await authenticatedClient.delete(`/users/${createdUser.id}`);

    await ApiAssertions.assertSuccessResponse(response);

    // Verify user is deleted
    const { response: getResponse } = await authenticatedClient.get(`/users/${createdUser.id}`);
    await ApiAssertions.assertNotFoundResponse(getResponse);
  });

  test('should require authentication for user operations', async ({ apiClient }) => {
    const userData = TestDataGenerator.generateUser();

    const { response } = await apiClient.post('/users', userData);

    await ApiAssertions.assertUnauthorizedResponse(response);
  });

  test('should validate user creation data', async ({ authenticatedClient }) => {
    const invalidUserData = TestDataGenerator.generateInvalidUser();

    const { response, data } = await authenticatedClient.post('/users', invalidUserData);

    await ApiAssertions.assertBadRequestResponse(response);
    await ApiAssertions.assertResponseHasProperty(data, 'errors');
    expect(Array.isArray(data.errors)).toBeTruthy();
  });
});