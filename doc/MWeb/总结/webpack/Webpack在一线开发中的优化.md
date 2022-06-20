# Webpack在一线开发中的优化

## 问题

首先，我们先大致看下我们都有什么问题，然后一步步进行解决

- 项目频繁进行修改，冗余文件过多
- 部分第三方依赖滥用，想去除但是不知道在哪个文件中。或没用，但是遗留在package.json里，
- 项目庞大，打包的结果过大，时间过长

## 方案

### 开发阶段

1. 监控编译面板
2. 开启通知面板
3. 开启多核压缩
4. 开启打包进度
5. 优化打包面板

### 上线阶段

1. 开启多核压缩
2. ES6不需要编译
3. 前端缓存小负载
4. 真正的loading
5. 分析打包结果CI
6. 压缩JS CSS

## 可视化工具

### speed-measure-webpack-[plugin](https://www.npmjs.com/package/speed-measure-webpack-plugin)

在对webpack打包进行优化时，首先要清楚的知道打包的整体时间、各种plugin、loader处理的时间，这样才能在优化时进行针对化的配置。

##### 安装

```js
npm install speed-measure-webpack-plugin --save-dev
```

##### 配置

```js
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const webpackConfig = smp.wrap({
    plugins: [
        new MyPlugin(),
        new MyOtherPlugin()
    ]
});
```

### webpack-bundle-analyzer

## 开启通知面板

### webpack-build-[notifier](https://www.npmjs.com/package/webpack-build-notifier)

使用node-notifier Webpack插件模块显示os级别的通知Webpack构建错误和警告。使用这个插件,你总是会通知的构建问题,而无需查看你的终端窗口。

##### 安装

```js
npm install webpack-build-notifier --save-dev
```

##### 配置

```js
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

module.exports = {
  // ... snip ...
  plugins: [
    new WebpackBuildNotifierPlugin({
      title: "Guohh的Webpack",
      logo: path.resolve("/Users/GHH/Documents/GHH/图片/ghh_logo/guohh_black.png"),
      suppressSuccess: true
    })
  ],
  // ... snip ...
}
```

## 开启打包进度

### progress-bar-webpack-[plugin](https://www.npmjs.com/package/progress-bar-webpack-plugin)

##### 安装：

```js
npm install progress-bar-webpack-plugin --save-dev
```

#####  配置：

```js
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
 
 
plugins: [
  new ProgressBarPlugin()
]
```

## 优化打包面板

### webpack-[dashboard](https://www.npmjs.com/package/webpack-dashboard)

##### 安装：

```js
npm install webpack-dashboard --save-dev
```

#####  配置：

```js
const DashboardPlugin = require("webpack-dashboard/plugin");
 
 
plugins: [
  new DashboardPlugin()
]

// 需要在packjson.json中将打包命令修改，在webpack前添加webpack-dashboard
"dev": "webpack-dashboard -- webpack --mode development",
```

## 开启多核压缩

### [uglifyjs-webpack-plugin](https://www.npmjs.com/package/uglifyjs-webpack-plugin)

这个是webpack官网推荐使用的，它常被用来进行js文件的压缩优化使用，通过`minimizer`属性实现。不过这里主要介绍它是如何开启多核压缩的。

##### 安装：

```js
npm install uglifyjs-webpack-plugin --save-dev
```

#####  配置：

```js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
         parallel: true,
      })
    ]
  }
};
```

也可使用node的api获取浏览器的cpu来全部开启

```js
const os = require("os")
// 将parallel属性配置为浏览器的cpu数
parallel: os.cpus().length,
```

### [webpack-parallel-uglify-plugin](https://www.npmjs.com/package/webpack-parallel-uglify-plugin)

它是比较老牌的插件了。它会开启多个子进程，把多个文件压缩的工作分别给多个子进程去完成，但是每个子进程还是通过UglifyJS去压缩代码。无非就是变成了并行处理该压缩，并行处理多个子任务。

##### 安装

```js
npm install webpack-parallel-uglify-plugin --save-dev
```

##### 配置

```js
// 引入 ParallelUglifyPlugin 插件
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');


module.exports = {
  plugins: [
    // 使用 ParallelUglifyPlugin 并行压缩输出JS代码
    new ParallelUglifyPlugin({
      test,// 使用正则去匹配哪些文件需要被 ParallelUglifyPlugin 压缩，默认是 /.js$/.
      include, //  使用正则去包含被 ParallelUglifyPlugin 压缩的文件，默认为 [].
      exclude, // 使用正则去不包含被 ParallelUglifyPlugin 压缩的文件，默认为 [].
      cacheDir, // 缓存压缩后的结果，下次遇到一样的输入时直接从缓存中获取压缩后的结果并返回，cacheDir 用于配置缓存存放的目录路径。默认不会缓存，想开启缓存请设置一个目录路径。
      sourceMap, // 是否为压缩后的代码生成对饮的SourceMap,默认不生成，开启后耗时会大大增加
      workerCount, // 开启几个子线程去并发的执行压缩。默认是当前运行电脑的CPU核数减一
      uglifyES:{},// 用于压缩es6 代码
      uglifyJS: {// 传递给 UglifyJS的参数如下：用于压缩es5 代码
        output: {
          /* 是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果， 可以设置为false */
          beautify: false,
          /* 是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为false */
          comments: false
        },
        compress: {
          /* 是否在UglifyJS删除没有用到的代码时输出警告信息，默认为输出，可以设置为false关闭这些作用 不大的警告 */
          warnings: false,
          /* 是否删除代码中所有的console语句，默认为不删除，开启后，会删除所有的console语句 */
          drop_console: true, 
          /* 是否内嵌虽然已经定义了，但是只用到一次的变量，比如将 var x = 1; y = x, 转换成 y = 5, 默认为不 转换，为了达到更好的压缩效果，可以设置为false */
          collapse_vars: true, 
          /* 是否提取出现了多次但是没有定义成变量去引用的静态值，比如将 x = 'xxx'; y = 'xxx'  转换成 var a = 'xxxx'; x = a; y = a; 默认为不转换，为了达到更好的压缩效果，可以设置为false */
          reduce_vars: true
        }
      }
    }),
  ]
}
```

##### 注：当文件数量较少时开启多核压缩，其实会增加webpack的打包速度的。

## ES6不需要编译

现代化的浏览器都是支持ES6语法的，所以对ES6的不进行编译。首先，为什么不提倡进行编译呢？通过babel-loader对ES6语法进行编译后，会使得文件变得很大。比如一个ES6的class，一个简单的三行class创建代码会编译成10多行代码，3个class更会编译成100多行；再比如：

```js
let a = 6;
// babel-loader编译后如下
try{
  throw 6;
}catch(a){
 
}
```

如上段代码，会将一个let的变量声明，写成这样一段。为什么呢？es5为了实现es6代码的块级作用域，所以使用了try catch。那么问题又来了，try catch在js进行垃圾回收(GC)的时候，就会对V8的优化进行去优化，而且还会造成作用域的延长，对js的性能造成问题。

如果一定要进行编译的话，可以在html的引用上进行下手，比如说在新特性的浏览器上使用ES6不编译的代码，在老牌浏览器上使用编译后的代码

```js
<script type='module' src="./main.es6.js"></script>
<script nomodule src="./main.es5.js"></script>
```

自动注入这段script代码可以使用[`html-webpack-plugin`](https://www.npmjs.com/package/html-webpack-plugin)进行自动注入。在package.json中分开打包两个包，一个带babel-loader一个不带

## 前端缓存小负载

前端也有很多的缓存介质，localStorage、sessionStorage、indexDB、serviceWork等对一些数据进行离线缓存，尤其是针对webapp来讲。

### [webpack-manifest-plugin](https://www.npmjs.com/package/webpack-manifest-plugin)

这是做前端性能优化的必会的一个插件，它会知道网站的所有资源，都是通过它来实现资源什么时候该去更新离线缓存。但是它需要后端进行配合，将生成的mainfest.json放到服务器上，每次都会请求这个文件。

##### 安装：

```js
npm install webpack-manifest-plugin --save-dev
```

#####  配置：

```js
const ManifestPlugin = require('webpack-manifest-plugin');
module.exports = {
  plugins: [
      new ManifestPlugin()
    ]
};
```

## 压缩JS CSS

### [webpack-parallel-uglify-plugin](https://www.npmjs.com/package/webpack-parallel-uglify-plugin)

##### 安装：

```js
npm install webpack-parallel-uglify-plugin --save-dev
```

#####  配置：

```js
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");
module.exports = {
  // 属性的解释、用法同uglifyjs-webpack-plugin类似，
  plugins: [
    new ParallelUglifyPlugin({
      test,
      include, 
      exclude:/\.min\.js$/, 
      workerCount:os.cpus().length,
      cacheDir,
      workerCount,
      sourceMap, 
      uglifyJS: { 
      	
      },
      uglifyES: {
      	output:{
          beautify:false,
          comments:false
        },
        compress:{
					warnings:false,
          drop_console:true,
          collapse_vars:true
        }
      }
    }),
  ],
};
```

## 总结

webpack的优化主要分为两块：**打包速度和打包后的包体积**。

**打包速度优化：**

1. 使用speed-measure-webpack-plugin 分析打包速度
2. 开启cache-control
3. 开启多核编译 happypack
4. 开启多进程编译 webpack-parallel-uglify-plugin
5. dllplugin和dllreferencePlugin用某种方法实现了拆分 bundles，同时还大大提升了构建的速度。
6. 使用name-all-modules-plugin 保证chunkid不变 持久化缓存

**优化包体积：**

1. 使用webpack-bundle-analyzer进行分析各个文件的大小进行对应处理
2. css-nano进行css tree的sharking ；webpack-deep-scope-plugin进行js的tree sharking
3. 第三方库按需加载
4. spliteChunks抽离公共文件
5. 进行文件的压缩 uglifyjs-webpack-plugin
6. babel按需加载 使用@babel/pollfiles





### [happypack](https://www.npmjs.com/package/happypack)

### [nano](https://www.npmjs.com/package/nano)

### [optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin)









test exculde include 如果每个loader                                                                                                                                                                                                                                                                                                               ，就会编译很快

[bundlesize](https://github.com/siddharthkp/bundlesize)

结合CI 进行，截取文件的大小

[webpack-chart](https://github.com/alexkuz/webpack-chart)

https://alexkuz.github.io/webpack-chart/

http://webpack.github.io/analyse