# webpack2-demo

A complete webpack build environment.

一套完整的 webpack2 的构建系统搭建。

* 分开发环境和生产环境

## 开发环境

开发环境使用的是 webpack-hot-server。

基础启动命令：

~~~shell
$ webpack-dev-server --config webpack-dev-server.config.js --progress --inline --colors --env.app=demo
~~~

其中 `--env.app=demo` 是自定义环境参数，用于指定打包入口文件。

启动后会在本地启一个 server，将打包的结果：一个 JS 和一个 CSS 发布出去，如：

~~~
http://localhost:9080/app.js
http://localhost:9080/app.css
~~~

代码实时生效，支持 `live-load`， 比用 `webpack --watch` 快速的多。

## 生产环境

一般基础的功能都包含在内。

基础启动命令：

~~~shell
$ webpack --config webpack-production.config.js --progress --colors [--watch] --env.app=demo
~~~

生产环境中针对公共模块的分离，实现了两种文案，在配置文件中，用大段的 = 注释隔开，两者选其一：

* CommonsChunkPlugin，在每次打包中，都会把一些例如：`react`、`react-dom` 等公共模块单独打包，实际对每次打包的过程没有什么改善。
* DllReferencePlugin，这个方案对公共模块的分离就比较彻底了，在执行这套方案前，先要单独执行一次 dll 的打包：`npm run dll`，
这样，在对业务代码进行打包时，会通过 `mainifest` 文件排除 dll 的公共模块，这样会大幅的减少打包时间，打出的 `app.js` 是纯业务代码，
当然，页面使用时需要将 `react.dll.js`、`router.dll.js`、`app.js` 依次引入。

推荐使用 `DllReferencePlugin` 的方案，这对于后期的更新上线、多个项目打包的支持都很有优势。

## 简单的命令行封装

对于生产环境的打包命令，因为一个构建系统要支持多个项目，入口文件各不相同，每次打包都要在配置文件中修改入口文件实在不方便，而且每次的打包命令还挺长的。
因此，写一个简单的 `wpbuild.js` 脚本，支持要打包项目路径的参数，也省了一堆的 `webpack` 命令参数。只用调用

~~~
node wpbuild.js --(`demo` or `demo/app.jsx`) [--server:启动开发 server] [--watch:生产环境的 watch 模式]
~~~

其中指定入口文件是**相对 `src`**的路径，参数有两种形式：

* 可以只写文件夹名称，如 `--demo`，此时会默认选择 `demo/app.jsx` 为入口文件
* 完整的入口文件路径，如 `--demo/xxx/app.jsx`

eg: 

~~~
// for product
npm run dll (这个是lib打包，只需要一次)
node wpbuild --demo --watch

// for dev
node wpbuild --demo --server
~~~

## 其它

支持 mobx 的注解。内置一个 demo 例子，可以自己尝试。
