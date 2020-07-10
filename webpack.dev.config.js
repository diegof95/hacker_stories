const path = require('path')
const HtmlWebpackPlugin  = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, '/dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/env', '@babel/react']
        }
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true, // To develop from cloud
    port: 9000,
  },
  devtool: 'source-eval-map'
}