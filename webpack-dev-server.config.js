/**
 * 开发环境 dev-server 构建方法
 */
const webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

const buildPath = path.resolve(__dirname, 'build'),
    nodeModulesPath = path.resolve(__dirname, 'node_modules');
/**
 * 需要构建项目的入口文件
 * 想对于当前目录
 */
//===========================================
const enterFile = 'demo/app.jsx';
//===========================================

module.exports = {
    //总入口文件
    entry: {
        server: [ 'webpack/hot/dev-server', 'webpack/hot/only-dev-server' ],
        app: path.join(__dirname, 'src', enterFile),
    },
    output: {
        path: buildPath,                //输出根目录
        publicPath: '',                 // 引用资源文件的base路径
        filename: './[name].js',        //输出文件名
    },
    //入口文件配置解析类型
    resolve: {
        //默认打包文件
        root: 'src',
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: [ 'node_modules' ],
    },
    //server 配置
    devServer: {
        contentBase: 'www', //发布目录
        devtool: 'cheap-module-eval-source-map',
        hot: true, //Live-reload
        inline: true,
        host: '0.0.0.0',
        port: 9080,
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        //Enables Hot Modules Replacement
        new webpack.HotModuleReplacementPlugin(),
        //Allows error warnings but does not stop compiling. Will remove when eslint is added
        // new webpack.NoErrorsPlugin(),
        //移动文件，如果发布目录和编辑目录不一致时，可以配置此项将编辑的 www 内容文件转移到发布目录
        /*
        new TransferWebpackPlugin([
            {
                from: 'www'
            }
        ], path.resolve(__dirname, "")),
        */
        //输出 CSS 文件
        new ExtractTextPlugin("./[name].css"),
    ],
    module: {
        //构建前置加载器
        preLoaders: [
            {
                //Eslint loader
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader',
                include: [ path.resolve(__dirname, "src") ],
                exclude: [ nodeModulesPath ],
            },
        ],
        loaders: [
            {
                test: /\.jpe?g$|\.gif$|\.png$/i,
                loader: "url-loader?limit=8192&name=./[name].[ext]",
            },
            //外置样式打包
            {
                test: /\.css/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader"),
            },
            {
                test: /\.less$/,
                //?{browsers:['> 1%', last 2 version', 'Android >= 4.0']}
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!less-loader"),
            },
            /**
             * 新版的 react-hot 不能局部刷新了？
             */
            {
                test: /\.(js|jsx)$/,
                loader: 'react-hot',
                include: [path.join(__dirname, '/src')],
                exclude: function (filePath) {
                    const isNpmModule = !!filePath.match(/node_modules/);
                    return isNpmModule;
                },
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel',
                include: [path.join(__dirname, '/src')],
                exclude: function (filePath) {
                    const isNpmModule = !!filePath.match(/node_modules/);
                    return isNpmModule;
                },
                query: {
                    plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties'],
                    presets: ['es2015', 'react'],
                },
            },
        ],
    },
    //eslint config 文件配置路径
    eslint: {
        configFile: '.eslintrc.json',
    },
};
