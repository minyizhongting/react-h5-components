const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const a = 'a';
const prodConfig = {
  mode: 'production',
  entry: path.join(__dirname, "../example/src/app.tsx"),
  output: {
    path: path.join(__dirname, "../example/dist"),
    filename: "bundle.js",
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
          use: [
            { 
              loader: "style-loader", 
            },
            { 
              loader: "css-loader",
              options: {
                modules: {
                  compileType: "module",
                  auto: true,
                  localIdentName: "[name]__[local]--[hash:base64:5]",
                  exportLocalsConvention: "camelCase",
                },
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              }
            }
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../example/src/index.html"),
      filename: "../dist/index.html"
    })
  ],
};

module.exports = prodConfig;
