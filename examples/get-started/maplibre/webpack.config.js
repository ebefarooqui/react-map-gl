const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',

  entry: {
    app: './app.js'
  },

  devtool: 'source-map',

  resolve: {
    alias: {
      'mapbox-gl': 'maplibre-gl'
    }
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env', '@babel/react']
            }
          }
        ]
      }
    ]
  },

  plugins: [new HtmlWebpackPlugin({title: 'react-map-gl Example'})]
};
