# 为什么用 gulp 打包 node

## 高效的gulp

#### 我们需要知道gulp打包的是哪些场景问题

1. gulp主打 简单，高效，生态
2. gulp内部使用的是node流机制，流自然就是不需要说了，是一种相当高效且不占内存的一种数据格式，它并不会过多的占用node的堆内内存，而且所占内存的最大值在30m以内，在流向最后一个消费者才会写入磁盘中，在打包过程中，并不会占用磁盘空间或者是内存

#### 1. node + gulp 打造高效开发体验面向未来开发

我们需要清晰的明白gulp如何正确切入node

##### nodejs的痛点---es支持度

由于es版本发布是相当快的，以及一些标准也是很超前的，但是node作为运行在服务端的js代码，对于这些es版本支持的新特性是不会更新这么快的,首当其冲的就是node对es的支持,在node历史长流中，要到2019年11月21日的13.2版本才正式支持 ESModule 特效，在13.2版本中的Stability 0，1，2中在生产模式只能使用 Stability 2 稳定版的api，而且在这个版本中nodejs默认启用对ES模块的实验支持，就是说，这里己经是默认允许我们在任何环境使用实验中的api了，当然即使这些实验中的api不稳定，在以往的Nodejs 8.9.0之后的版本中需要在启动项目时需要制定特定的参数`--experimental-modules`，开启对es支持以及对实验性api支持主流浏览器都能通过` <script type="module"> `标签支持ECMAScript 模块(ES modules)。各种项目npm包都使用了ES模块编写，并且可以通过 `<script type="module"＞`在浏览器中直接使用。支持导入映射(import maps)即将登陆Chrome。import map将让浏览器支持node.js风格的包名导入基于这个问题，在node开发中引入一个中间处理器以支持我们面向未来开发的方式

#### 2. 打包工具的对比

```js
* gulp 
* Rollup
* webpack
```

首先对于node程序的打包要求，这里简单说几点

1. 在打包后需支持最新的es版本
2. 打包编译速度不能太慢，这样对开发进度可控
3. 打包后的文件结构不能发生变化，如有需要可发生一点点变化
4. 配置文件友好

首先第一排除的就是webpack，因为webpack配置起来是比较麻烦的，而且还有很多插件需要版本兼容；在第三点中，打包后文档结构不能发生变化，这样就可以放弃Rollup了，因为Rollup号称将所有小文件打包成一个大的lib或者是bin文件，就是Rollup是适合多人共同开发一个库，比较出名的vue就是使用Rollup打包工具进行打包的，那么这里选择gulp的理由是，

1. 编译速度快
2. 开发并不占用很多的电脑内存空间
3. 保持文件结构不变
4. gulp还能有rollup同样的功能，可以生成cjs或者是mjs格式的js文件

#### 3. gulp打包流程

我们先看一下如何使用gulp打包node项目，下面是一个简单的示例

```js
├── app.js
├── config
│   └── index.js
├── controllers
│   └── IndexController.js
├── libs
│   └── SafeRequest.js
├── logs
│   └── app.log
├── middlewares
│   └── errorHandler.js
└── services
    └── IndexController.js
```

除了logs的文件不需要进行文件转换，其他文件都是需要进行es转换的
对于es的转换，首先想到的很明显就是babel了，所以我们的build文件就如下

```js
const gulp, { series } = require('gulp');
const watch = require('gulp-watch');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber'); // 保证在构建流中,一些error 不会影响构建流 , plumber会将这些error unpipe()掉

const entry = './src/server/**/*.js'; // 需要打包的文件
const rollup = require('gulp-rollup');

const cleanEntry = './src/server/config/index.js';
const replace = require('@rollup/plugin-replace');

/* 同时我们需要区分生产环境和开发环境, 同时为了功能分开, 同时还有新起一个转换环境 */

// 开发环境
function buildDev() {
  return watch(entry, { ignoreInitial: false },
    () => {
      gulp
        .src(entry)
        .pipe(plumber())
        .pipe(
          babel({
            babelrc: false,
            plugins: [ /* @babel/plugin-proposal-decorators支持使用装饰器; @babel/plugin-transform-modules-commonjs支持es6开发  */
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              '@babel/plugin-transform-modules-commonjs',
            ],
          }),
        )
        .pipe(gulp.dest('dist'));/*输出到对应的文件中*/
    })
}

// 上线环境, 上线环境和开发环境差不多, 只是少了一个watch过程
function buildProd() {
  return gulp
    .src(entry)
    .pipe(
      babel({
        babelrc: false,
        ignore: [cleanEntry],
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          '@babel/plugin-transform-modules-commonjs',
        ],
      }),
    )
    .pipe(gulp.dest('dist'));
}

// 转换环境, 这里就是将我们开发时使用的装饰器和es6,7,8代码转换成nodejs长期支持版本支持的语法
function buildconfig() {
  return gulp
    .src(entry)
    .pipe(
      rollup({
        input: cleanEntry,
        output: {/* 输出的格式 */
          format: 'cjs',
        },
        plugins: [
          replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
        ],
      }),
    )
    .pipe(gulp.dest('./dist'));
}

/* 环境区分 */
let build = gulp.series(buildDev);
if (process.env.NODE_ENV === 'production') {
  build = gulp.series(buildprod, buildconfig);
}
gulp.task('default', build); // 进行构建任务, 这里的default是一个任务名称, 可以自行命名


/*
开发环境注意 , 初次执行
调用 watch() 之后，关联的任务（task）是不会被立即执行的，而是要等到第一次文件修之后才执行。

如需在第一次文件修改之前执行，也就是调用 watch() 之后立即执行，请将 ignoreInitial 参数设置为 false。
delay: 保存文件后延迟多少时间执行
*/
/*
Gulp 有一个名为 fsevents 的可选依赖项，他是一个特定于 Mac 系统的文件监控程序。如果你看到安装 fsevents 时出现的警告信息 - "npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents" - 这并不是什么问题，忽略即可。 如果跳过 fsevents 的安装，将使用一个备用文件监控程序，后续在 gulpfile 中产生的任何错误都将与此警告无关。
*/
/*
series(), 接收多个参数, 表示执行多个任务
*/
```

以上就是使用gulp打包node的一个简单配置文件，同时为了让我们gulp打包更加灵活，我们需要对多个打包工具进行合并，比如当团队开发的时候，需要开发服务中的util包，这时候，我们就要新开辟一个util包的入口文件，这里就可以使用rollup进行打包util了；