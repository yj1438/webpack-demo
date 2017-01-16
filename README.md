# webpack-demo

A complete webpack build environment.

一套完整的 webpack 的构建系统搭建。

* 分开发环境和生产环境

## 开发环境

开发环境使用的是 webpack-hot-server, 在配置文件中设定一个入口文件路径 `enterFile`，直接用 

~~~
npm run server
~~~

启动即可，会在本地启一个 server，将打包的结果：一个 JS 和一个 CSS 发布出去，如：

~~~
http://localhost:9080/app.js
http://localhost:9080/app.css
~~~

代码实时生效，比用 `webpack --watch` 在快速的多。

## 生产环境

生产环境中针对公共模块的分离，实现了两种文案，在配置文件中，用大段的 = 注释隔开：

* CommonsChunkPlugin，在每次打包中，都会把一些例如：`react`、`react-dom` 等公共模块单独打包，实际对每次打包的过程没有什么改善。
* DllReferencePlugin，这个方案对公共模块的分离就比较彻底了，在执行这套方案前，先要单独执行一次 dll 的打包：`npm run dll`，
这样，在对业务代码进行打包时，会通过 `mainifest` 文件排除 dll 的公共模块，这样会大幅的减少打包时间，打出的 `app.js` 是纯业务代码，
当然，页面使用时需要将 `react.dll.js`、`router.dll.js`、`app.js` 依次引入。

推荐使用 `DllReferencePlugin` 的方案，这对于后期的更新上线、多个项目打包的支持都很有优势。

## 简单的命令行封装

对于生产环境的打包命令，因为一个构建系统要支持多个项目，入口文件各不相同，每次打包都要在配置文件中修改入口文件实在不方便，而且每次的打包命令不挺长的。
因此，写一个简单的 `wpbuild.js` 脚本，支持要打包项目路径的参数，也省了一堆的 `webpack` 命令参数。只用调用

~~~
node wpbuild.js --demo
~~~

就会找到开发目录 `src` 下的 `demo` 文件夹的 `app.jsx`(定死) 入口文件进行打包。也支持 `--watch` 参数，开启监听。

## 其它

支持 mobx 的注解。内置一个 demo 例子，可以自己尝试。

eg: 

~~~
// for product
npm run dll
node wpbuild --demo

// for dev
npm run server
~~~