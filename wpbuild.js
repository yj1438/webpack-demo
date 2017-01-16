/**
 * webpack 打包脚本
 * 用于生产环境
 * @--watch 监听构建
 * @--path <entryFilePath> 入口文件路径;
 *      :相对于 src 文件夹，eg.: app/app.jsx，可以只写目录，默认入口文件名为 app.jsx
 */
const childProcess = require('child_process'),
    argv = process.argv;
let pathArr = [],
    isWatch = false;

/**
 * 拼接入口文件名
 */
if (argv[2] && argv[2].indexOf('--') === 0) {
    const destApp = argv[2].replace('--', '');
    pathArr = destApp.split('/');
    if (pathArr.length === 1 || !pathArr[1]) {
        pathArr[1] = 'app.jsx';
    }
}
else {
    console.log('please input the project\'s name ant main app.js');
    return;
}

/**
 * 是否是监听模式
 */
if (argv[3] && argv[3] === '--watch') {
    isWatch = true;
}

/**
 * 拼接生成命令
 * 因为有监听模式，需要命令执行后挂起，所以用 `spawn` 命令
 *      `spawn` 命令行参数用的是数组 eg.: ['--config', 'webpack-production.config.js']
 */
const execCommand = 'webpack --config webpack-production.config.js --progress --colors' +
                    (isWatch ? ' --watch' : '') +
                    ' --path ' + pathArr.join('/');
const params = execCommand.split(' ');
params.shift(0);
console.log(params);

/**
 * 开始执行命令
 */
const cmdProcess = childProcess.spawn('webpack', params);

cmdProcess.stdout.on('data', (data) => {
    console.log('cmdProcess data printout: ');
    console.log(`${data}`);
});
cmdProcess.stderr.on('data', (data) => {
    // console.log(`${data}`);
    // console.log(data);
});
cmdProcess.on('close', (data) => {
    console.log(`child process exited with code ${data}`);
});
