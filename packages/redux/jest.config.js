/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['file-size-cache', 'node_modules'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
}

module.exports = config
