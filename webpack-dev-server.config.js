/**
 * 开发环境 dev-server 构建方法
 */
const webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

const buildPath = path.resolve(__dirname, 'build'),
    nodeModulesPath = path.resolve(__dirname, 'node_modules');
/**
 * 需要构建项目的入口文件
 * 想对于当前目录
 */
//===========================================
const enterFile = 'demo/app.jsx';
//===========================================

const webpackConfig = {
    //总入口文件
    entry: {
        'hot-server': ['webpack/hot/dev-server', 'webpack/hot/only-dev-server'],
        'app': path.join(__dirname, 'src', enterFile),
    },
    output: {
        path: buildPath,                //输出根目录
        publicPath: '',                 // 引用资源文件的base路径
        filename: '[name].js?[hash]',        //输出文件名
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
        devtool: 'cheap-module-source-map',
        hot: true, //Live-reload
        inline: true,
        host: '0.0.0.0',
        port: 9080,
    },
    devtool: 'cheap-module-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"',
        }),
        //Enables Hot Modules Replacement
        new webpack.HotModuleReplacementPlugin(),
        //Allows error warnings but does not stop compiling. Will remove when eslint is added
        // new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin("[name].css?[hash]"),
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
                loader: "url-loader?limit=8192&name=[name].[ext]",
            },
            //外置样式打包
            {
                test: /\.css/,
                loader: ExtractTextPlugin.extract("css-loader!autoprefixer-loader"),
            },
            {
                // test: /\.less$/,
                test(filePath) {
                    return /\.less$/.test(filePath) && !/\.module\.less$/.test(filePath);
                },
                loader: ExtractTextPlugin.extract("css-loader!autoprefixer-loader?{browsers:['> 1%', 'Android >= 4.0']}!less-loader"),
            },
            {
                test: /\.module\.less$/,
                loader: ExtractTextPlugin.extract(
                `${require.resolve('css-loader')}?` +
                'sourceMap&modules&localIdentName=[local]___[hash:base64:5]&-autoprefixer!' +
                `${require.resolve('postcss-loader')}!` +
                `${require.resolve('less-loader')}?` +
                `{"sourceMap":true,"modifyVars":${JSON.stringify({})}}`
                ),
            },
            // {
            //     test: /\.less$/,
            //     //?{browsers:['> 1%', last 2 version', 'Android >= 4.0']}
            //     loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!less-loader"),
            // },
            {
                test: /\.(js|jsx)$/,
                loader: 'bundle?lazy&name=[name].app',
                include: /\/routers\//,
            },
            { test: /\.jsx?$/, loaders: ['react-hot', 'jsx?harmony'], exclude: /node_modules/ },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-decorators-legacy', 'transform-class-properties'],
                    presets: ['es2015', 'react', 'stage-2'],
                },
            },
            
        ],
    },
    //eslint config 文件配置路径
    eslint: {
        configFile: '.eslintrc.json',
    },
};
// 模板
const htmlPluginTpl = ['index', 'detail'].map(function (item) {
    return new HtmlWebpackPlugin({
        filename: item + '.html',
        template: 'src/demo/tpl/index.html',
    });
});
webpackConfig.plugins = webpackConfig.plugins.concat(htmlPluginTpl);

module.exports = webpackConfig;
