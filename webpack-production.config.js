/**
 * 生产环境发布方法
 */
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackMd5Hask = require('webpack-md5-hash');
/**
 * 此 webpack 构建可支持最新的 ES6/7 + reactjs
 * 确定一个入口文件后，进行完整的依赖打包：
 * 1. 将所有依赖 js 打在一起
 * 2. css/less 文件没有打进 js，个人实用感受，这样很有维护性，否则 js 文件很乱
 * 3. 所需的图片先进行压缩，再将小于8k的图片转成 base64 写入 css，大于8k的文件放入 baby-img 库
 */

/*
 * 获取入口文件
 */
const argv = process.argv,
    index = argv.indexOf('--path');

if (index === -1 || !argv[index + 1]) {
    console.log('缺少入口文件，请添加参数: --path <入口文件相对 src 路径>');
    return;
}
const projectName = argv[index + 1],
    projectPathArr = projectName.split('/');

console.log('开始构建文件：' + projectName);

const buildPath = path.resolve('dist', projectPathArr[0]);
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
    entry: {
        // polyfill: ['babel-polyfill']     //如果是要强力增强兼容性，比如要在低版本桌面浏览器上用，就加上'babel-polyfill'，把整个babel环境都打进去
        // ============= for CommonsChunkPlugin start =============
        // vendor: ['react', 'react-dom'],
        // router: ['react-router'],
        // ============= for CommonsChunkPlugin end =============
        app: path.join(__dirname, 'src', projectName),
    },
    resolve: {
        root: 'src',
        extensions: ["", ".js", ".jsx"],
        modulesDirectories: ['node_modules'], //(Default Settings)
    },
    /*
     * Render source-map file for final build
     * 选择cheap-source-map，这个比 source-map 快不少
     */
    // devtool: 'cheap-module-source-map',
    output: {
        path: buildPath,       //输出路径
        publicPath: '',                             //src 的 base 路径
        filename: './[name].[chunkhash].js',      //输出的文件名
    },
    plugins: [
        /*
         * 将打包环境定为生产环境
         */
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"',
            },
        }),
        /**
         * 以下有两套打包策略：commonchunk 和 dllreference，两者都可以将一些公共模块分离出去，区别有下：
         * commonchunk 只是每次打包的时候进行分离，实际打包量还是全量
         * dllreference 是在打包前就将公共模块分享出去，每次打包的代码是净业务代码，适合一套构建系统支持多个项目时使用
         */
        /* ============================== commonchunk start ====================================
         * 将公共模块分离出去 （这个和 DllReferencePlugin 二选一）
         */
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: [ 'router', 'vendor' ],
        //     minChunks: Infinity,
        // }),
        // ============================== commonchunk end ====================================
        //
        /* ============================== dllreference start ====================================
         * 打包时排除 react模块 （这个和 CommonsChunkPlugin 二选一）
         * 极大的提高打包速度
         *  这个和上面的那个 webpack.optimize.CommonsChunkPlugin 本质上是一致的，
         *  更先进的是彻底将 react 的核心包排出了全部打包过程
         *  所以打包时候会大幅的减少，一般会快 7s
         *  代价只是需要更新核心包时，手动执行一遍 react-dll 相关命令，还会整体变大50K左右，不知道是怎么回事
         */
        new webpack.DllReferencePlugin({
            context: '.',
            //sourceType: "commonsjs2",
            manifest: require(path.join(__dirname, 'dist', 'react-manifest.json')),
        }),
        new webpack.DllReferencePlugin({
            context: '.',
            //sourceType: "commonsjs2",
            manifest: require(path.join(__dirname, 'dist', 'router-manifest.json')),
        }),
        // ============================== dllreference end ====================================
        // 去重
        new webpack.optimize.DedupePlugin(),
        // 根据使用率来预测分配序列
        new webpack.optimize.OccurenceOrderPlugin(),
        /*
         * 压缩
         */
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            comments: false,
        }),
        //只报出错误或警告，但不会终止编译，建议如果是开发环境可以把这一项去掉
        // new webpack.NoErrorsPlugin(),
        // 真正的文件 md5 hash
        new WebpackMd5Hask(),
        //输出 CSS 文件
        new ExtractTextPlugin('./[name].[chunkhash].css'),
    ],
    module: {
        //eslint
        preLoaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader',
                include: [path.resolve(__dirname, "src")],
                exclude: [nodeModulesPath],
            },
        ],
        loaders: [
            //"file-loader?name=img/[hash:8].[name].[ext]",
            //压缩图片，不过这个压缩很慢，先不加了"!img-loader?minimize",
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: "url-loader?limit=8192&name=./[name].[ext]?[chunkhash]",
            },
            //外置样式打包
            {
                test: /\.css/,
                loader: ExtractTextPlugin.extract("css-loader!autoprefixer-loader?{browsers:['> 1%', 'Android >= 4.0']}"),
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
            //     loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader?{browsers:['> 1%', 'Android >= 4.0']}!less-loader"),
            // },
            /**
             * js/jsx 编译
             * @query 编译参数，这里配置后，不再需要.babelrc文件
             *      plugins
             *          transform-runtime
             *      presets:
             *          es2015 ES6
             *          stage-0 ES7
             *          react JSX
             */
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
    /*
     * img-loader
     * img-loader?minimize 对应的压缩参数
     */
    imagemin: {
        gifsicle: { interlaced: false },
        jpegtran: {
            progressive: true,
            arithmetic: false,
        },
        optipng: { optimizationLevel: 7 },
        pngquant: {
            floyd: 0.5,
            speed: 2,
        },
        svgo: {
            plugins: [
                { removeTitle: true },
                { convertPathData: false },
            ],
        },
    },
    //Eslint config
    eslint: {
        configFile: '.eslintrc.json', //Rules for eslint
    },
};
