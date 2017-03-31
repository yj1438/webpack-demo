/**
 * 开发环境 dev-server 构建方法
 */
const webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

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
        entry: [
            'react-hot-loader/patch',
            // activate HMR for React

            'webpack-dev-server/client',
            // bundle the client for webpack-dev-server
            // and connect to the provided endpoint

            // 'webpack/hot/dev-server',
            // 'webpack/hot/only-dev-server',
            // bundle the client for hot reloading
            // only- means to only hot reload for successful updates
            './' + projectEntryFile,
        ],
        output: {
            // path: path.resolve(__dirname, 'dist'),                     // server 不用指定path
            publicPath: '/',                 // 引用资源文件的base路径
            filename: './app.js',        //输出文件名
        },
        //入口文件配置解析类型
        resolve: {
            extensions: ['.js', '.jsx'],
            modules: [ 'node_modules' ],
        },
        //server 配置
        devServer: {
            contentBase: path.join(__dirname, "www"),   //发布目录
            hot: true,                                  //Live-reload 对应 'webpack/hot/dev-server'
            // hotOnly: true,                           //Live-reload 对应 'webpack/hot/only-dev-server'  这个是为了可以不刷新动态替换内容，但多数情况下会报警告，要求刷新页面
            inline: true,
            port: 8080,
            host: '0.0.0.0',
            compress: false,
            lazy: false,
            clientLogLevel: 'warning',                     //none, error, warning or info
            publicPath: '/',
        },
        devtool: 'inline-source-map',        // https://webpack.js.org/configuration/devtool/
        plugins: [
            //Enables Hot Modules Replacement
            new webpack.HotModuleReplacementPlugin(),
            // prints more readable module names in the browser console on HMR updates
            new webpack.NamedModulesPlugin(),
            //输出 CSS 文件
            new ExtractTextPlugin({
                filename: "./app.css",
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
                    query:  { limit: 8192, name: './[name].[ext]' },
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
                            'autoprefixer-loader?{browsers:["> 1%", "Android >= 4.0"]}',
                            'less-loader',
                        ],
                        // publicPath: "/dist",
                    }),
                },
                {
                    test: /\.(js|jsx)$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties', 'react-hot-loader/babel'],
                        presets: [['es2015', {'modules': false}], 'react'],
                    },
                },
            ],
        },
    };
};
