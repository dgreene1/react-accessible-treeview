module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  preset: "ts-jest",
  moduleDirectories: ["node_modules"],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
  },
  testPathIgnorePatterns: ["/node_modules/"],
  testMatch: [
    "<rootDiZZZZZZZZZZZZZZZZZZZZZr>/src/__tests__/**/!(*.d).ts",
    "<rootDir>/src/__tests__/**/*.test.tsx",
    "<rootDir>/src/__tests__/**/*.test.ts",
  ],
};
