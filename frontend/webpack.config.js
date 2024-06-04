const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { maxHeaderSize } = require("http");

module.exports = {
  mode: "production",
  devServer: {
    port: 3000
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  parallelism: 1,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: {
          loader: "file-loader",
        },
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
        include: path.join(__dirname, "./src"),
      },
      {
        test: /\.d\.ts$/,
        use: "ignore-loader",
      },
    ],
  },
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      util: require.resolve("util/"),
      crypto: require.resolve("crypto-browserify"),
      zlib: require.resolve("browserify-zlib"),
      stream: require.resolve("stream-browserify"),
      http: require.resolve("stream-http"),
      url: require.resolve("url/"),
      assert: false,
      constants: false,
      vm: false,
      os: false,
      querystring: false,
      buffer: false,
      https: false,
      fs: false,
      esbuild: false,
      module: false,
      "@swc/core": false,
      worker_threads: false,
      child_process: false,
      tty: false,
      "uglify-js": false,
      extensions: [".ts", ".js"],
    },
    extensions: ["*", ".js", ".jsx", ".css", ".svg", ".png", ".ts"],
    mainFields: ["browser", "module", "main"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/icon'),
          to: path.resolve(__dirname, 'dist/images'),
        },
      ],
    }),
  ],
};
