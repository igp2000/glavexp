/* eslint-disable no-undef */

const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
//const EncodingPlugin = require('webpack-encoding-plugin');

const devMode = process.env.NODE_ENV?.trim() !== 'production';

module.exports = {
  entry: {
    index: './src/index.jsx',
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  mode: devMode ? 'development' : 'production',

  devtool: devMode ? 'source-map' : false,

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        include: path.resolve(__dirname, 'src'),
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.s?css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(svg|png|jpe?g|webp|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        //type: 'asset/inline',
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false,
        charset: 'utf-8',
      },
    }),

    // кладем css в /css/styles.css
    new MiniCssExtractPlugin({
      filename: 'css/styles.css',
    }),

    new CleanWebpackPlugin(),

    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [autoprefixer()],
      },
    }),

    // new EncodingPlugin ({
    //   encoding: 'utf-8'
    // }),

    // применяет изменения только при горячей перезагрузке
    // hot: true (ниже) автоматически включает этот плагин
    // new webpack.HotModuleReplacementPlugin(),
  ],

  devServer: {
    port: 7700,
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    static: './dist',
  },
};
