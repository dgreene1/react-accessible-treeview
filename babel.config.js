module.exports = function(api) {
  api.cache(true);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            browsers: ["last 2 versions", "safari >= 7"]
          },
          modules: false
        }
      ],
      "@babel/preset-react"
    ],
    env: {
      test: {
        presets: [["react-app"]]
      }
    },
    plugins: ["@babel/plugin-proposal-object-rest-spread"]
  };
};
