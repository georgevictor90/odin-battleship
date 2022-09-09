const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: "Battleships",
      template: "./src/template.html",
      filename: "index.html",
    }),
  ],
  mode: "development",
  devtool: "inline-source-map",
  output: {
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "./"),
    },
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
