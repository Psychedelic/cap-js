module.exports = {
  roots: [
    '<rootDir>/tests/',
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["<rootDir>/tests/**/*.(spec|test).ts"],
  setupFiles: ["<rootDir>/tests/setup-tests.ts"],
  testTimeout: 30000,
};