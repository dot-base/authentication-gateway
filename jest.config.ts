/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",  // map @ to absolute path,
      "^@tests/(.*)$": "<rootDir>/tests/$1"
    },
    setupFiles: ["<rootDir>/tests/setEnvVars.js"]
};
