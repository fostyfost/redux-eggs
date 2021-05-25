// TODO: use ts-jest
module.exports = {
  // roots: ['<rootDir>'],
  // testMatch: [
  //   '<rootDir>/**/*.test.ts',
  //   '<rootDir>/**/*.test.tsx',
  // ],
  // testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  // collectCoverageFrom: ['**!/!*.{js,jsx,ts,tsx}', '!**!/!*.d.ts', '!**!/node_modules/!**', '!**!/.yarn/!**'],
  // testPathIgnorePatterns: ['node_modules', '.yarn', '.next'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules', '.yarn', '^.+\\.module\\.(css|sass|scss)$'],
  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    //  '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '@/(.*)': '<rootDir>/$1',
  },
}
