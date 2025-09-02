# Playwright API Test Framework

API testing framework built with Playwright, designed for robust, scalable, and maintainable API testing.

### 1. Installation

```
npm install
npx playwright install
```

### 2. Environment Setup

Copy the example environment file and configure your settings:

```
cp .env.example .env
```

Edit `.env` with your API endpoints and credentials.

### 3. Run Tests

```
# Run all tests
npm test

# Run specific test suites
npm run test:api
npm run test:auth
npm run test:users
npm run test:health

# Run with UI mode
npm run test:ui

# Generate and view reports
npm run report
```

## Project Structure

### Core Directories

- **`tests/`**: All test files organized by feature
  - `api/`: API endpoint tests
  - `integration/`: End-to-end workflow tests
- **`utils/`**: Reusable utilities and helpers
- **`fixtures/`**: Test fixtures and setup code
- **`config/`**: Environment and test configuration
- **`reports/`**: Generated test reports

### Key Files

- **`playwright.config.js`**: Main Playwright configuration
- **`utils/api-client.js`**: HTTP client wrapper with auth support
- **`utils/assertions.js`**: Custom assertion library for API responses
- **`utils/test-data.js`**: Test data generators using Faker.js
- **`fixtures/auth-fixtures.js`**: Authentication test fixtures

## Available Fixtures

- **`apiClient`**: Unauthenticated API client
- **`authenticatedClient`**: Admin-authenticated API client
- **`userClient`**: Regular user-authenticated client
- **`cleanUserClient`**: Creates fresh user for each test


## Environment Configuration

Set your test environment:

```
export TEST_ENV=staging
npm test
```

Supported environments: `development`, `staging`, `production`

## Continuous Integration

The framework is CI-ready with:

- Configurable retry logic
- Multiple report formats
- Parallel test execution
- Environment variable support


### Debug Mode

Run tests in debug mode for detailed troubleshooting information:

```
npm run test:debug
```

## Contributing

1. Follow the existing folder structure
2. Add new test utilities to `utils/`
3. Create fixtures for reusable test setup
4. Include both positive and negative test cases
5. Add appropriate assertions and error handling

## License

MIT License

## Project Structure 
<pre>
playwright-api-tests/
├── package.json
├── playwright.config.js
├── .gitignore
├── README.md
├── tests/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.spec.js
│   │   │   └── logout.spec.js
│   │   ├── users/
│   │   │   ├── users-crud.spec.js
│   │   │   └── users-validation.spec.js
│   │   └── health/
│   │       └── health-check.spec.js
│   └── integration/
│       └── workflow.spec.js
├── utils/
│   ├── api-client.js
│   ├── test-data.js
│   ├── assertions.js
│   └── helpers.js
├── fixtures/
│   ├── auth-fixtures.js
│   ├── user-fixtures.js
│   └── test-responses.json
├── config/
│   ├── environments.js
│   └── test-config.js
└── reports/
    └── .gitkeep
</pre>