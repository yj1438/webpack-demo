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
    isWatch = false,
    isServer = false;

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
    console.log('please input the project\'s name such as \'$ node wpbuild.js --demo\'');
    return;
}

/**
 * 是否是监听模式
 */
if (argv.indexOf('--serve')) {
    isServer = true;
} 
else if (argv[3] && argv[3] === '--watch') {
    isWatch = true;
} 

/**
 * 拼接生成命令
 * 因为有监听模式，需要命令执行后挂起，所以用 `spawn` 命令
 *      `spawn` 命令行参数用的是数组 eg.: ['--config', 'webpack-production.config.js']
 */
let execCommand,
    execCommandBin,
    execCommandParam;
if (!isServer) {
    execCommand = './node_modules/.bin/webpack --config webpack-production.config.js --progress --colors' +
                    (isWatch ? ' --watch' : '') +
                    ' --env.app=' + pathArr.join('/');
} else {
    execCommand = './node_modules/.bin/webpack-dev-server --config webpack-dev-server.config.js --progress --inline --colors --env.app=' + pathArr.join('/');
}
const params = execCommand.split(' ');
execCommandBin = params.shift(0);
execCommandParam = params;
console.log(execCommandBin, execCommandParam);

/**
 * 开始执行命令
 */
const cmdProcess = childProcess.spawn(execCommandBin, execCommandParam);

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
