/**
 * 开发环境 dev-server 构建方法
 */
const webpack = require('webpack'),
  path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env) {
  let projectEntryFile = env.app;
  if (!projectEntryFile) {
    console.log('缺少入口文件，请添加参数: --env.path=<项目入口文件/目录>');
    return null;
  }
  const projectPathArr = projectEntryFile.split('/');
  if (projectPathArr.length === 1 || !projectPathArr[1]) {
    projectPathArr[1] = 'app.jsx';
  }
  projectEntryFile = projectPathArr.join('/');
  console.log('开始构建文件：' + projectEntryFile);

  return {
    //总入口文件
    context: path.resolve(__dirname, "src"),
    entry: {
      app: './' + projectEntryFile,
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
    mode: 'development',
    //server 配置
    devServer: {
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
    },
    devtool: 'inline-source-map',        // https://webpack.js.org/configuration/devtool/
    plugins: [
      //Enables Hot Modules Replacement
      new webpack.HotModuleReplacementPlugin(),
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
    ],
    module: {
      rules: [
        //构建前置加载器
        {
          //Eslint loader
          test: /\.(js|jsx)$/,
          enforce: "pre",         // pre post
          loader: 'eslint-loader',
          include: [path.resolve(__dirname, "src")],
          query: {
            configFile: '.eslintrc.json',
          },
          exclude: [/node_modules/],
        },
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
            ],
          }),
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              'css-loader',
              'less-loader',
            ],
          }),
        },
        {
          test: /\.(js|jsx)$/,
          loader: 'react-hot-loader',
          include: [path.join(__dirname, '/src')],
          exclude: [/node_modules/],
        },
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
