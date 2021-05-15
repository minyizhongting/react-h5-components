const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const devConfig = {
  mode: 'development',
  entry: path.join(__dirname, "../example/src/app.tsx"),
  output: {
    path: path.join(__dirname, "../example/src/"),
    filename: "bundle.js",
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
                  // localIdentName: "[name]__[local]--[hash:base64:5]",
                  localIdentName: "[name]__[local]",
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
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, '../example/src/'),
    compress: true,
    host: '127.0.0.1',
    port: 3001,
    open: false,
  },
};

module.exports = devConfig;
