module.exports = {
  collectCoverageFrom: ['**!/!*.{js,jsx,ts,tsx}', '!**!/!*.d.ts', '!**!/node_modules/!**'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    //  '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '@/(.*)': '<rootDir>/$1',
  },
}
