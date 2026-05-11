import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },

  testMatch: ['**/tests/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  clearMocks: true,

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};

export default config;
