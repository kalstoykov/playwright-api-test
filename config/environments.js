const environments = {
  development: {
    baseURL: 'http://localhost:3000',
    timeout: 30000,
    retries: 0,
    workers: 1
  },
  staging: {
    baseURL: process.env.STAGING_URL || 'https://staging-api.example.com',
    timeout: 45000,
    retries: 1,
    workers: 2
  },
  production: {
    baseURL: process.env.PROD_URL || 'https://api.example.com',
    timeout: 60000,
    retries: 2,
    workers: 1
  }
};

const getCurrentEnvironment = () => {
  const env = process.env.TEST_ENV || 'development';
  return environments[env] || environments.development;
};

module.exports = {
  environments,
  getCurrentEnvironment
};