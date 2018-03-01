/**
 * webpack.DllReferencePlugin 插件配置文件
 * 把 react react-dom 分离出去
 * 生成 [name]-manifest.json 文件放在 dist/dll 下，供 production 时使用
 */
const path = require('path'),
  webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// dist 路径相关
const distPath = path.resolve(__dirname, 'dist');

module.exports = {
  entry: {
    react: ['react', 'react-dom'],
    router: ['react-router'],
  },
  output: {
    path: distPath,                         //输出路径, 必须用绝对路径
    filename: '[name].[chunkhash].dll.js',
    library: '[name]_lib',
  },
  mode: 'production',
  plugins: [
    // DllPlugin 生成公共模块
    new webpack.DllPlugin({
      /*
       * 定义 manifest 文件生成的位置
       * [name] 的部分由 entry 的名字替换
       */
      path: path.resolve(distPath, '[name]-manifest.json'),
      /*
       * name
       * dll bundle 输出到哪个全局变更上
       * 和 output.library 一样即可
       */
      name: '[name]_lib',
      context: __dirname,
    }),
    //压缩
    new UglifyJsPlugin(),
  ],
};
