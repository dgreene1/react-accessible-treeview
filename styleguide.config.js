module.exports = {
  title: "react-accessible-treeview",
  usageMode: "hide",
  components: "src/TreeView/**/index.js",
  serverPort: 5000,
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    }
  },
  sections: [
    {
      name: "Documentation",
      components: "src/TreeView/index.js"
    },
    {
      name: "Examples",
      components: "src/TreeView/examples/**/index.js",
      exampleMode: "collapse", // 'hide' | 'collapse' | 'expand'
      usageMode: "collapse" // 'hide' | 'collapse' | 'expand'
    }
  ]
};
