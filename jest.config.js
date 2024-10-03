// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  verbose: true,
  testMatch: ['**/?(*.)spec.js?(x)'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testEnvironment: 'jsdom'
};
