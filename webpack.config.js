/**
 * 开发环境 dev-server 构建方法
 */
const webpack = require('webpack'),
  path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

const postcssOpt = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: [
      autoprefixer({
        browsers: ['iOS >= 8', 'Android >= 4']
      }),
    ]
  }
};

const serverOpt = {
  // contentBase: path.join(__dirname, "www"),   //发布目录
  hot: true,                                  //Live-reload
  hotOnly: true,
  inline: true,
  host: '0.0.0.0',
  compress: false,
  lazy: false,
  clientLogLevel: 'none',                     //none, error, warning or info
  port: 9080,
  // publicPath: "http://localhost:8080/static/",
};

module.exports = function (env) {
  console.log(env);
  const isDev = env.NODE_ENV === 'development';
  console.log('development ' + isDev);
  console.log('开始构建文件：src/demo/app.jsx');
  return {
    //总入口文件
    context: path.resolve(__dirname, "src"),
    entry: {
      app: './demo/app.jsx',
    },
    output: {
      // path: ''                     // server 不用指定path
      publicPath: '',                 // 引用资源文件的base路径
      filename: './[name].js',        //输出文件名
    },
    //入口文件配置解析类型
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: ['node_modules'],
    },
    mode: isDev ? 'development' : 'production',
    //server 配置
    devServer: isDev ? serverOpt : undefined,
    devtool: 'inline-source-map',        // https://webpack.js.org/configuration/devtool/
    plugins: [
      //Enables Hot Modules Replacement
      ...(isDev ? [new webpack.HotModuleReplacementPlugin()] : []),
      //输出 CSS 文件
      new ExtractTextPlugin({
        filename: "./[name].css",
        disable: false,
        allChunks: true,
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.join(__dirname, 'template/index.html')
      }),
      new webpack.LoaderOptionsPlugin({
        // test: /\.xxx$/, // may apply this only for some modules
        options: {
          postcss: {
            plugins: [
              autoprefixer({
                browsers: ['iOS >= 8', 'Android >= 4']
              })
            ]
          },
        }
      }),
    ],
    module: {
      rules: [
        //构建前置加载器
        // {
        //   //Eslint loader
        //   test: /\.(js|jsx)$/,
        //   enforce: "pre",         // pre post
        //   loader: 'eslint-loader',
        //   include: [path.resolve(__dirname, "src")],
        //   query: {
        //     configFile: '.eslintrc.json',
        //   },
        //   exclude: [/node_modules/],
        // },
        {
          test: /\.jpe?g$|\.gif$|\.png$/i,
          loader: 'url-loader',
          query: { limit: 8192, name: './[name].[ext]' },
        },
        //外置样式打包
        {
          test: /\.css/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              'css-loader',
              postcssOpt
            ],
          }),
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              'css-loader',
              postcssOpt,
              'less-loader',
            ],
          }),
        },
        isDev ? {
          test: /\.(js|jsx)$/,
          loader: 'react-hot-loader',
          include: [path.join(__dirname, '/src')],
          exclude: [/node_modules/],
        } : {},
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          include: [path.join(__dirname, '/src')],
          exclude: [/node_modules/],
        },
      ],
    },
  };
};