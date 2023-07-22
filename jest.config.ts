import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default",
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: false,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // The test environment that will be used for testing
  testEnvironment: "jest-environment-node",

  // A map from regular expressions to paths to transformers
  transform: {},

  resolver: "ts-jest-resolver",
};

export default config;
