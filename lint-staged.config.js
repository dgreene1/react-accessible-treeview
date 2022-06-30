module.exports = {
  linters: {
    "**/*.+(js|md|css|json)": ["eslint --fix", "prettier --write", "git add"],
  },
};
