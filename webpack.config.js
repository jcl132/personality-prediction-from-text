const webpack = require('webpack');
const config = {
    entry:  __dirname + '/static/js/index.jsx',
    output: {
        path: __dirname + '/static/dist',
        filename: 'bundle.js',
    },
    devServer: {
        contentBase: "./static",
        hot: true
    },
    module: {
      rules: [
        {
          test: /\.jsx?/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: ["react-hot-loader/babel"]
            }
          }
        }
      ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
};
module.exports = config;
