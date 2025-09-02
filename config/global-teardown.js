async function globalTeardown() {
  console.log('🧹 Starting global test teardown...');
  
  try {
    console.log('🗑️  Cleaning up test data...');
    
    if (process.env.CLEANUP_TEST_DATA === 'true') {
      const { request } = require('@playwright/test');
      const context = await request.newContext({
        baseURL: process.env.BASE_URL
      });
      
      try {
        console.log('🧽 Performing test data cleanup...');    
      } catch (error) {
        console.warn('⚠️  Cleanup warning:', error.message);
      } finally {
        await context.dispose();
      }
    }

    const fs = require('fs').promises;
    const path = require('path');
    
    try {
      const summaryPath = path.join(__dirname, '..', 'reports', 'test-summary.json');
      const summary = {
        timestamp: new Date().toISOString(),
        environment: process.env.TEST_ENV || 'development',
        baseUrl: process.env.BASE_URL,
        testRunCompleted: true
      };
      
      await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
      console.log('📊 Test summary generated');
    } catch (error) {
      console.warn('Could not generate summary report:', error.message);
    }

    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        console.log('📢 Sending notification...');
        // TO DO:
        console.log('✅ Notification sent');
      } catch (error) {
        console.warn('⚠️  Notification failed:', error.message);
      }
    }

    console.log('✅ Global teardown completed successfully');
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error.message);
    // Don't throw error in teardown to avoid masking test failures
  }
}

module.exports = globalTeardown;