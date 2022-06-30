module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  moduleFileExtensions: ["js", "jsx"],
  moduleDirectories: ["node_modules"],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
};
