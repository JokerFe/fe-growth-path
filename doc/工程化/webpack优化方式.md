# Webpack的优化方式

### 构建速度优化

1. 使用高版本的Webpack

2. 多线程/多进程进行构建： HappyPack(已停止更新维护)、thread-loader

3. 缩小打包作用域

   * exclude/include(指定打包范围)
   * resolve.modules 指明第三方模块的绝对路径(减少打包时的不必要查找)
   * resolve.extensions尽可能减少后缀尝试的可能
   * noParse对完全不需要解析的进行忽略，不去解析但仍会打包到bundle中，注意被忽略掉的文件里不应该包含import、require、define等模块话语句
   * IgnorePlugin 完全排除模块
   * 合理使用alias

4. 充分利用缓存提升二次构建速度

   * babel-loader开启缓存
   * terser-webpack-plugin开启缓存‘
   * 使用cache-loader或者hard-source-webpack-plugin

   注意： thread-loader和cache-loader要一起使用的话，先设置cache-loader，然后是 thread-loader，最后是heavy-loader

5. DLL，使用DllPlugin进行分包，使用DllReferencePlugin（索引链接）对mainfest.json引用，让一些基本不会改动的代码先打包成静态资源，避免反复编译浪费时间

### 使用webpack4优化的原因

1. V8带来的优化(for of替代forEach、Map和Set替代Object、 includes替代indexOf)
2. 默认使用更快的md4 hash算法
3. webpacks AST可以直接从loader传递给AST，减少解析时间
4. 使用字符串方法替代正则表达式

##### ① noParse

*  不去解析某个库内部的依赖关系
* 比如jquery 这个库是独立的，则不去解析这个库内部依赖的其他的东西
* 在独立库的时候可以使用

```js
module.exports = {
  module: {
    noParse: /jquery/,
    rules:[]
  }
}
```

##### ② IgnorePlugin

* 忽略掉某些内容 不去解析依赖库内部引用的某些内容
* 从moment中引用./locol 则忽略掉
* 如果要用local的话 则必须在项目中必须手动引入` import 'moment/locale/zh-cn'`

```js
module.exports  = plugins: [ new Webpack.lgnorePlugin(/./local/， /moment/), ]}
```

##### ③ dillPlugin

* 不会多次打包，优化打包时间
* 先把依赖的不变的库打包
* 生成 manifest.json文件
* 然后在webpack.config中引入`webpack.DiPlugin Webpack.DllReferencePlugin`

##### ④ happypack -> thread-loader

* 大项目的时候开启多线程打包
* 影响前端发布速度的有两个方面，一个是构建，一个就是压缩，把这两个东西优化起来，可以减少很多发布的时间。

##### ⑤ thread -loader 

thread-loader 会将您的 loader 放置在一个 worker 池里面运行，以达到多线程构建。把这个 loader 放置在其他 loader 之前（如下图 example 的位置），放置在这个 loader 之后的 loader 就会在一个单独的 worker 池 (worker pool)中运行。

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve("src"),
        use: [
          "thread-loader",
          // 你的高开销的loader放置在此 (e.g babel-loader)
        ]
      }
    ]
  }
}
```

每个 worker 都是一个单独的有 600ms 限制的 node.js 进程。同时跨进程的数据交换也会被限制。请在高开销的loader中使用，否则效果不佳

##### ⑥ 压缩加速——开启多线程压缩

不推荐使用 webpack-paralle-uglify-plugin，项目基本处于没人维护的阶段，issue 没人处理，pr没人合并。
Webpack 4.0以前：uglifyis-webpack-plugin, parallel 参数

```js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
      }),
    ],
  },};
```

推荐使用 terser-webpack-plugin

```js
module.exports = {
  optimization: {
    minimizer: [new TerserPlugin(
      parallel: true   // 多线程
    )],
  },
};
```



### **优化 webpack 的打包体积**

- 压缩代码
  - webpack-paralle-uglify-plugin
  - uglifyjs-webpack-plugin 开启 parallel 参数 (不支持es6)
  - terser-webpack-plugin 开启 parallel 参数
  - 多进程并行压缩
  - 通过 html-webpack-externals-plugin 提取 chunk 中的 css 代码到单独文件，通过optimize-css-assets-webpack-plugin插件 开启 cssnano 压缩 css。
- 提取页面公共资源：
  - 使用 html-webpack-external-plugin，将基础包通过 CDN 引入，不打入bundle 中
  - 使用 SpliteChunkPlugin 进行(公共脚本、基础包、页面公共文件)分离(webpack4内置) ，替代了 CommonsChunkplugin 插件
  - 基础包分离：将一些基础库放到CDN，比如vue，webpack 配置 external是的vue不打入bundle
- Tree Sharking
  - purgecss-webpack-plugin 和 mini-css-extract-plugin配合使用(建议)
  - 打包过程中检测工程中没有引用过的模块并进行标记，在资源压缩时将它们从最终的bundle中去掉(只能对ES6 Module生效) 开发中尽可能使用ES6 Module的模块，提高Tree Sharking效率
  - 禁用 斄攊斄壝攋-攋壏攊攃壝巇 的模块依赖解析，否则 webpack 接收到的就都是转换过的 濲壏斅斅壏壣攡廭 形式的模块，无法进行 瀀巇壝壝-斔擾攊孂廽壣噖
  - 使用 廰孆巇廽濱巙濲廭廭(不在维护) 或者 孆壣css 去除无用 濲廭廭 代码
- Scope hoisting
  - 构建后的代码会存在大量闭包，造成体积增大，运行代码时创建的函数作用域变多，内存开销变大。Scope hoisting 将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突
  - 必须是ES6的语法，因为有很多第三方库仍采用 CommonJS 语法，为了充分发挥 Scope hoisting 的作用，需要配置 mainFields 对第三方模块优先采用 `jsnext:main` 中指向的ES6模块化语法
- 图片压缩
  - 使用基于 Node 库的 imagemin(很多定制选项、可以处理多种图片格式）
  - 配置` image-webpack-loader`
- 动态Polyfll
  - 建议采用 polyfil-service 只给用户返回需要的polyfl，社区维护。(部分国内奇葩浏览器UA可能无法识别，但可以降级返回所需全部polyil)
  - `@babel-preset-env` 中通过`useBuitins:'usage'`参数来动态加载polyfll。

### speed-measure-webpack-plugin 

简称 SMP，分析出 Webpack 打包过程中 Loader 和 Plugin 的耗时，有助于找到构建过程中的性能瓶颈。

