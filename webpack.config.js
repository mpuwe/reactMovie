// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',  // your entry file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // important for dev server
  },
  mode: 'development',
  devServer: {
    static: './public',
    hot: true,
    port: 8083,  // your port
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],  // loaders for css files
      },
      {
        test: /\.jsx?$/,  // For js/jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // assuming you are using babel
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
