/**
 * 开发环境 dev-server 构建方法
 */
const webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * 需要构建项目的入口文件
 * 想对于当前目录
 */
//===========================================
const enterFile = 'demo/app.jsx';
//===========================================

module.exports = function (env) {
    // console.log(env);    // for --env.production
    return {
        //总入口文件
        context: path.resolve(__dirname, "src"),
        entry: {
            app: './' + enterFile,
        },
        output: {
            publicPath: '',                 // 引用资源文件的base路径
            filename: './[name].js',        //输出文件名
        },
        //入口文件配置解析类型
        resolve: {
            extensions: ['.js', '.jsx'],
            modules: [ 'node_modules' ],
        },
        //server 配置
        devServer: {
            contentBase: path.join(__dirname, "www"),   //发布目录
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
        ],
        module: {
            rules: [
                //构建前置加载器
                {
                    //Eslint loader
                    test: /\.(js|jsx)$/,
                    enforce: "pre",         // pre post
                    loader: 'eslint-loader',
                    include: [ path.resolve(__dirname, "src") ],
                    query: {
                        configFile: '.eslintrc.json',
                    },
                    exclude: [/node_modules/],
                },
                {
                    test: /\.jpe?g$|\.gif$|\.png$/i,
                    loader: 'url-loader',
                    options:  { limit: 8192, name: './[name].[ext]' },
                },
                //外置样式打包
                {
                    test: /\.css/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            'css-loader',
                            'autoprefixer-loader',
                        ],
                        // publicPath: "/dist",
                    }),
                },
                {
                    test: /\.less$/,
                    //?{browsers:['> 1%', last 2 version', 'Android >= 4.0']}
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            'css-loader',
                            'autoprefixer-loader',
                            'less-loader',
                        ],
                        // publicPath: "/dist",
                    }),
                },
                {
                    test: /\.(js|jsx)$/,
                    loader: 'react-hot-loader',
                    include: [path.join(__dirname, '/src')],
                    exclude: function (filePath) {
                        const isNpmModule = !!filePath.match(/node_modules/);
                        return isNpmModule;
                    },
                },
                {
                    test: /\.(js|jsx)$/,
                    loader: 'babel-loader',
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
    };
};
