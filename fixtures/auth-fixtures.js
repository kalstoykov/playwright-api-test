const base = require('@playwright/test');
const { ApiClient } = require('../utils/api-client');

const test = base.extend({
  // Unauthenticated API client
  apiClient: async ({ baseURL }, use) => {
    const client = new ApiClient(baseURL);
    await client.init();
    await use(client);
    await client.dispose();
  },

  // Authenticated API client with admin user
  authenticatedClient: async ({ baseURL }, use) => {
    const client = new ApiClient(baseURL);
    await client.init();
    
    // Login with admin credentials
    const { response, data } = await client.post('/auth/login', {
      email: process.env.ADMIN_EMAIL || 'admin@test.com',
      password: process.env.ADMIN_PASSWORD || 'admin123'
    });
    
    if (response.ok()) {
      await client.setAuthToken(data.token);
    }
    
    await use(client);
    await client.dispose();
  },

  // Regular user authenticated client
  userClient: async ({ baseURL }, use) => {
    const client = new ApiClient(baseURL);
    await client.init();
    
    // Login with regular user credentials
    const { response, data } = await client.post('/auth/login', {
      email: process.env.USER_EMAIL || 'user@test.com',
      password: process.env.USER_PASSWORD || 'user123'
    });
    
    if (response.ok()) {
      await client.setAuthToken(data.token);
    }
    
    await use(client);
    await client.dispose();
  },

  // Clean user - creates and authenticates a new user for each test
  cleanUserClient: async ({ baseURL }, use) => {
    const client = new ApiClient(baseURL);
    await client.init();
    
    // Create new user
    const userData = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'testPassword123!'
    };
    
    await client.post('/auth/register', userData);
    
    // Login with new user
    const { response, data } = await client.post('/auth/login', {
      email: userData.email,
      password: userData.password
    });
    
    if (response.ok()) {
      await client.setAuthToken(data.token);
    }
    
    await use(client);
    await client.dispose();
  }
});

module.exports = { test };