module.exports = {
  title: "react-accessible-treeview",
  usageMode: "expand",
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
  }
};
