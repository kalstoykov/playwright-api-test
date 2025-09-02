require('dotenv').config();

async function globalSetup() {
  console.log('🚀 Starting global test setup...');
  
  try {
    // Verify environment variables
    const requiredEnvVars = ['BASE_URL'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
      console.warn('Using default values...');
    }

    // Set default values if not provided
    process.env.BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
    process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@test.com';
    process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
    process.env.USER_EMAIL = process.env.USER_EMAIL || 'user@test.com';
    process.env.USER_PASSWORD = process.env.USER_PASSWORD || 'user123';

    console.log(`🌐 Base URL: ${process.env.BASE_URL}`);
    console.log(`📧 Admin Email: ${process.env.ADMIN_EMAIL}`);
    
    // Optional: Perform health check
    const { request } = require('@playwright/test');
    const context = await request.newContext();
    
    try {
      console.log('🏥 Performing API health check...');
      const response = await context.get(`${process.env.BASE_URL}/health`);
      
      if (response.ok()) {
        console.log('✅ API is healthy and ready for testing');
      } else {
        console.warn(`⚠️  API health check failed with status: ${response.status()}`);
        console.warn('Tests may fail if the API is not running');
      }
    } catch (error) {
      console.warn('⚠️  Could not reach API for health check:', error.message);
      console.warn('Make sure your API is running before executing tests');
    } finally {
      await context.dispose();
    }

    // Create reports directory if it doesn't exist
    const fs = require('fs').promises;
    const path = require('path');
    const reportsDir = path.join(__dirname, '..', 'reports');
    
    try {
      await fs.mkdir(reportsDir, { recursive: true });
      console.log('📁 Reports directory ready');
    } catch (error) {
      console.warn('Could not create reports directory:', error.message);
    }

    console.log('✅ Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error.message);
    throw error;
  }
}

module.exports = globalSetup;