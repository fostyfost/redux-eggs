/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
const config = {
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/$1',
  },
  preset: 'ts-jest',
}

module.exports = config
