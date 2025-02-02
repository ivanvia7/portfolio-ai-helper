const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js", // The main logic for the extension
    background: [
      "./src/background/backgroundMain.js",
      "./src/background/auth/authHandlersLogic.js",
      "./src/background/auth/authNewUser.js",
      "./src/background/auth/authUtils.js",
      "./src/background/auth/authLogout.js",
      "./src/background/api/authCalls.js",
      "./src/background/api/noteCalls.js",
      "./src/background/api/summaryCalls.js",
    ],
    popup: "./src/popup.js", // Optional popup (if used)
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "module", // Use ES module output
    module: true,
  },
  mode: "development",
  devtool: false,
  watch: true,
  plugins: [
    new CleanWebpackPlugin(), // Ensures old files are deleted
    new CopyWebpackPlugin({
      patterns: [{ from: "static" }],
    }),
  ],
  optimization: {
    splitChunks: false, // Prevent splitting for Chrome extensions
  },
  experiments: {
    outputModule: true, // Enable experimental module output
  },
};
