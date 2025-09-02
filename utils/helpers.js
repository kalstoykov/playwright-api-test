const fs = require('fs').promises;
const path = require('path');

class TestHelpers {
  static async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async retry(fn, maxAttempts = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }
        await this.wait(delay);
      }
    }
  }

  static async saveTestData(filename, data) {
    const reportsDir = path.join(__dirname, '..', 'reports');
    await fs.mkdir(reportsDir, { recursive: true });
    await fs.writeFile(
      path.join(reportsDir, `${filename}.json`),
      JSON.stringify(data, null, 2)
    );
  }

  static async loadTestData(filename) {
    const filePath = path.join(__dirname, '..', 'reports', `${filename}.json`);
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  static generateRequestId() {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static async pollUntilCondition(
    conditionFn, 
    maxWaitTime = 10000, 
    interval = 500
  ) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      if (await conditionFn()) {
        return true;
      }
      await this.wait(interval);
    }
    
    throw new Error(`Condition not met within ${maxWaitTime}ms`);
  }

  static validateJsonSchema(data, schema) {
    const errors = [];
    
    for (const [key, expectedType] of Object.entries(schema)) {
      if (!(key in data)) {
        errors.push(`Missing required property: ${key}`);
        continue;
      }
      
      if (typeof data[key] !== expectedType) {
        errors.push(`Invalid type for ${key}: expected ${expectedType}, got ${typeof data[key]}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static extractAuthToken(response) {
    const authHeader = response.headers().authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }

  static createPaginationParams(page = 1, limit = 10, sortBy = 'id', sortOrder = 'asc') {
    return new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    }).toString();
  }

  static async cleanupTestData(apiClient, resourceType, resourceIds) {
    const deletePromises = resourceIds.map(id => 
      apiClient.delete(`/${resourceType}/${id}`).catch(() => {
        // Ignore cleanup errors
      })
    );
    
    await Promise.allSettled(deletePromises);
  }

  static generateBatchTestData(generator, count = 5) {
    return Array.from({ length: count }, () => generator());
  }

  static async measureResponseTime(apiCall) {
    const startTime = Date.now();
    const result = await apiCall();
    const endTime = Date.now();
    
    return {
      ...result,
      responseTime: endTime - startTime
    };
  }

  static formatTestReport(testName, results) {
    return {
      testName,
      timestamp: new Date().toISOString(),
      results,
      summary: {
        total: results.length,
        passed: results.filter(r => r.passed).length,
        failed: results.filter(r => !r.passed).length
      }
    };
  }
}

module.exports = { TestHelpers };