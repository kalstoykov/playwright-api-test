const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
    testDir: './tests',
    timeout: 30000,
    expect: {
        timeout: 5000
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', { outputDir: './reports/html' }],
        ['json', { outputFile: './reports/test-results.json' }],
        ['junit', { outputFile: './reports/junit.xml' }],
        ['list']
    ],
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:3000',
        extraHTTPHeaders: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        ignoreHTTPSErrors: true,
        trace: 'on-first-retry'
    },
    projects: [
        {
            name: 'API Tests',
            testMatch: '**/api/**/*.spec.js',
            use: {
                ...devices['Desktop Chrome']
            }
        },
        {
            name: 'Integration Tests',
            testMatch: '**/integration/**/*.spec.js',
            use: {
                ...devices['Desktop Chrome']
            },
            dependencies: ['API Tests']
        }
    ],
    globalSetup: './config/global-setup.js',
    globalTeardown: './config/global-teardown.js'
});