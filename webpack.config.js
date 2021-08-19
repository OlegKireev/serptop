const path = require('path');
// const webpack = require("webpack");

module.exports = {
  output: {
    filename: 'main.js',
  },
  module: {
    rules: [
      // {
      //     test: require.resolve("Swiper"),
      //     loader: "expose-loader",
      //     options: {
      //         exposes: ["Swiper"],
      //     },
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      '%root%': path.resolve(__dirname),
      '%blocks%': path.resolve(__dirname, 'src/blocks'),
      '%libs%': path.resolve(__dirname, 'src/libs'),
    },
  },
};
