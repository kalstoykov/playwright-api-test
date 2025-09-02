const { getCurrentEnvironment } = require('./environments');

class TestConfig {
  static getConfig() {
    const env = getCurrentEnvironment();
    
    return {
      // Environment settings
      environment: process.env.TEST_ENV || 'development',
      baseURL: env.baseURL,
      timeout: env.timeout,
      retries: env.retries,
      workers: env.workers,
      
      // Authentication
      auth: {
        adminEmail: process.env.ADMIN_EMAIL || 'admin@test.com',
        adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
        userEmail: process.env.USER_EMAIL || 'user@test.com',
        userPassword: process.env.USER_PASSWORD || 'user123'
      },
      
      // Test data
      testData: {
        cleanupAfterTests: process.env.CLEANUP_TEST_DATA === 'true',
        generateFakeData: true,
        maxRetries: parseInt(process.env.MAX_RETRIES) || 3
      },
      
      // Reporting
      reporting: {
        generateReports: process.env.GENERATE_REPORTS !== 'false',
        slackWebhook: process.env.SLACK_WEBHOOK_URL,
        outputDir: './reports'
      },
      
      // Performance thresholds
      performance: {
        maxResponseTime: 5000,
        healthCheckTimeout: 2000,
        loginTimeout: 10000
      },
      
      // External services
      external: {
        apiKey: process.env.EXTERNAL_API_KEY,
        webhookUrl: process.env.WEBHOOK_URL
      }
    };
  }
  
  static getAuthHeaders(token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }
  
  static getDefaultHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Playwright-API-Tests/1.0'
    };
  }
  
  static isCI() {
    return !!process.env.CI;
  }
  
  static shouldRetry() {
    return this.isCI() ? 2 : 0;
  }
}

module.exports = { TestConfig };