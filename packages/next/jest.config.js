/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
}

module.exports = config
