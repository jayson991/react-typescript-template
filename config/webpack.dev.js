const path = require('path')
const env = require('./env.dev')
const webpack = require('webpack')
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const APP_PATH = path.resolve(__dirname, '../src')

module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: [path.resolve(__dirname, '../src/index.tsx')],
  output: {
    publicPath: '/',
    filename: 'scripts/[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, '../src/'),
    },
  },
  devServer: {
    hot: true,
    port: 8080,
    compress: true,
    progress: true,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        include: APP_PATH,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.jsx?$/,
        include: APP_PATH,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [require.resolve('react-refresh/babel')].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|bmp|png|webp|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8].[ext]',
        },
      },
      {
        exclude: [/(^|\.(mjs|[jt]sx?|s?css|html|json))$/],
        type: 'asset/resource',
        generator: {
          filename: 'medias/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env,
      NODE_ENV: env.NODE_ENV,
      API_ENDPOINT: env.API_ENDPOINT,
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
    new HtmlWebpackPlugin({
      cache: false,
      inject: true,
      showErrors: true,
      favicon: path.resolve(__dirname, '../public/favicon.ico'),
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new ReactRefreshWebpackPlugin(),
  ],
}
