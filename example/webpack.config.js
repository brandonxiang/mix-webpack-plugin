const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { MixWebpackPlugin } = require('mix-webpack-plugin');

const client = {
  mode: "development",
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new MixWebpackPlugin({
      handler: './server/handler.js'
    })
 ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
  },
};



module.exports = client