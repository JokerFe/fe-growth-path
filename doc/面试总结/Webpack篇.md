[toc]

## Webpack 4

#### webpack热更新

使用插件 webpack-dev-server  实现热更新

##### webpack 中hash、chunkhash、contenthash的区别

**hash**：跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的hash值都会改变，并且全部文件使用同一个hash值。
**chunkhash**：它根据不同的入口文件进行依赖文件解析、构建对应的chunk，生成对应的哈希值。我们生产环境里把一些公共库和程序入口文件区分开，单独打包构建，只要我们不改变公共库的代码，就可以保证其哈希值不会受影响。
**contenthash**：具体到模块内容，只要模块内容不变，就不会重新构建，可以配合extra-text-webpack-plugin里的contenthash值。
webpack中的实现：比如webpack@4用mini-css-extract-plugin单独分离了css，然后插件中设置filename（  new MiniCssExtractPlugin({filename: 'static/css/[name].[contenthash:8].css'})  ） js的话就在output中设置filename
vue-cli中的实现：在vue.config.js里配置

#### 核心模块

```javascript
Entry: 指定webpack开始构建的入口模块，从该模块开始构建并计算出直接或间接依赖的模块或者库。
Output：告诉webpack如何命名输出的文件以及输出的目录
Module: 模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
Chunk：coding split的产物，我们可以对一些代码打包成一个单独的chunk，比如某些公共模块，去重，更好的利用缓存。或者按需加载某些功能模块，优化加载时间。在webpack3及以前我们都利用CommonsChunkPlugin将一些公共代码分割成一个chunk，实现单独加载。在webpack4 中CommonsChunkPlugin被废弃，使用SplitChunksPlugin
Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
Plugin：扩展插件，在 Webpack 构建流程中的特定时机会广播出对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情。
```

#### 打包流程

```javascript
Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
确定入口：根据配置中的 entry 找出所有的入口文件；
编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。
```

#### 编译结果

```javascript
(function(modules) {
  // 模拟 require 语句
  function __webpack_require__() {
  }
  // 执行存放所有模块数组中的第0个模块
  __webpack_require__(0);
})([/*存放所有模块的数组*/])

- 重写_webpack_require文件加载模式，模仿commonjs规范实现
- 将所有的js文件都已键值对的方式存入一个对象中，由_webpack_require来调用
```

#### Loader

一个 Loader 的职责是单一的，只需要完成一种转换。将源文件经过loader的编译，处理成浏览器识别的代码，这个过程可能需要多个步骤，那么就需要多个loader来处理。

**如何编写loader**

```javascript
const loaderUtils = require('loader-utils');
module.exports = function(source) {
  // 获取到用户给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(this);
  return source;
};
```

#### Plugin

webpack通过plugin机制让其配置更加灵活，它会在运行的生命周期中留下钩子，让plugin来监听这些生命周期钩子，在合适的时候来调用钩子进行文件的处理。

```javascript
- complier：包含了webpack环境中所有的配置信息，比如options、loaders、plugins等，可以理解为webpack的实例
- compilation：包含了当前的模块资源、编译生成资源、变化的文件等。
- Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。
```

webpack的编译是通过事件流编译的。主要通过TapTable来实现插件的binding和applying，它是用于事件发布订阅执行的插件架构，是webpack用来构建钩子的库。

```javascript
- 调用complier.hooks.run.tap开始注册
- 创建compilation
- 基于配置创建chunks
- 使用parser解析chunks
- 使用module和dependency管理代码模块相互依赖
- 使用template基于compilation数据生成结果代码
```

#### 优化

```javascript
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
```



#### 总结

🍊webpack是一个**打包模块化**JavaScript的工具，它将一切文件都视为模块，通过loader编译转换文件，通过plugin注入钩子，最后将输出的资源模块组合成文件。🍊它主要的**配置信息**有entry、output、modules、plugins。🍊它的**编译过程**为：**第一步**先初始化参数，通过yargs将webpack.config.js和shell脚本的配置信息合并，进行参数的初始化；**第二步**利用初始化的参数创建complier对象，complier可以视为一个webpack的实例，存在于webpack从启动到结束的整个过程，它包含了webpack的module、plugin等参数信息，	然后调用complier.run方法开始编译。**第三步**根据entry配置信息找到入口文件，创建compilation对象，可以理解为webpack一次编译的过程，包含了当前编译环境的所有资源，包括编译后的文件。**第四步**通过配置信息，调用loader进行模块翻译，使用acorn将模块转换为AST，当遇到require依赖时，创建依赖并加入依赖数组，再找出依赖的依赖，递归异步的处理所有的依赖。**第五步**完成第四步后将得到所有模块的依赖关系和模块翻译后的文件，然后调用compilation.seal方法，对这些模块和根据模块依赖关系创建的chunk进行整理，将所有资源进行合并拆分等操作。这是最后一次能修改输出内容的地方。**第六步**根据配置信息中的output配置，进行最后模块的文件输出，指定输出文件名和文件路径。🍊webpack**打包输出**后的文件其实就是一个闭包，传入的参数是一个对象，键值为所有输出文件的路径，内容为eval包裹的文件内容；闭包内重写了模块的加载方式，自己定义了`__webpack_require__方法，来实现模拟的commonjs规范模块加载机制。🍊**loader**是单一职责，只进行一种类型的转换，它的主要作用就是将源文件模块进行翻译，转换为浏览器识别的代码，如果需要进行多步转换就要调用多个loader。编写自己的loader时需要引用官方提供的laoder-utils ，调用loaderUtils.getOptions(this)拿到webpack的配置参数，然后进行自己的处理。🍊**plugin**让webpack的机制更加灵活，它在编译过程中留下的一系列生命周期的钩子，通过调用这些钩子来实现在不同编译结果时对源模块进行处理。它的编译是基于事件流来编译的，主要通过taptable来实现插件的绑定和执行的，taptable主要是基于发布订阅执行的插件架构，是用来创建声明周期钩子的库。调用complier.hooks.run.tap开始注册，创建compilation，基于配置创建chunks，在通过parser解析chunks，使用模块和依赖管理模块之间的依赖关系，最后使用template基于compilation数据生成结果代码 🍊webpack的优化主要是对打包速度和包体积进行优化。**包体积优化**通过webpack-bundle-analyzer对输出文件进行分析，通过图形显示文件的大小，然后逐个分析处理。主要有1. tree-sharking 用到的插件有cssnano和webpack-deep-scope-plugin；2. 第三方库按需加载；3.路由懒加载；4. splitechunk抽离公共文件；5. 文件压缩加密 uglifyjs-webpack-plugin ；6. babel使用@babel/pollfile进行按需加载。**打包速度优化**通过speed-measur-webpack-plugin分析打包速度，然后对打包慢的loader开启cache-control，还可以使用happypack开启多核编译，使用webpack-parallel-uglify-plugin开启多进程编译，或者使用dllplugin和dllreferencePlugin实现拆分bundles，还能提高构建的速度，或者使用name-all-modules-plugin保证chunkid不变进行持久化缓存。

## webpack优化

```javascript
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
```

🍊 构建速度优化

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

🍊 使用webpack4优化的原因

1. V8带来的优化(for of替代forEach、Map和Set替代Object、 includes替代indexOf)
2. 默认使用更快的md4 hash算法
3. webpacks AST可以直接从loader传递给AST，减少解析时间
4. 使用字符串方法替代正则表达式

① noParse

*  不去解析某个库内部的依赖关系
*  比如jquery 这个库是独立的，则不去解析这个库内部依赖的其他的东西
*  在独立库的时候可以使用

```js
module.exports = {
  module: {
    noParse: /jquery/,
    rules:[]
  }
}
```

② IgnorePlugin

* 忽略掉某些内容 不去解析依赖库内部引用的某些内容
* 从moment中引用./locol 则忽略掉
* 如果要用local的话 则必须在项目中必须手动引入` import 'moment/locale/zh-cn'`

```js
module.exports  = plugins: [ new Webpack.lgnorePlugin(/./local/， /moment/), ]}
```

③ dillPlugin

* 不会多次打包，优化打包时间
* 先把依赖的不变的库打包
* 生成 manifest.json文件
* 然后在webpack.config中引入`webpack.DiPlugin Webpack.DllReferencePlugin`

④ happypack -> thread-loader

* 大项目的时候开启多线程打包
* 影响前端发布速度的有两个方面，一个是构建，一个就是压缩，把这两个东西优化起来，可以减少很多发布的时间。

⑤ thread -loader 

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

⑥ 压缩加速——开启多线程压缩

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

🍊  **优化 webpack 的打包体积**

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

speed-measure-webpack-plugin 

简称 SMP，分析出 Webpack 打包过程中 Loader 和 Plugin 的耗时，有助于找到构建过程中的性能瓶颈。



##  tree-shaking 的原理

当前端项目到达一定的规模后，我们一般会采用按模块方式组织代码，这样可以方便代码的组织及维护。但会存在一个问题， 比如我们有一个utils工具类，在另一个模块中导入它。这会在打包的时候将utils中不必要的代码也打包，从而使得打包体积变大，这时候就需要用到Tree shaking技术了。
Tree shaking 是一种通过清除多余代码方式来优化项目打包体积的技术，专业术语叫`Dead code elimination`

🍊 原理

利用 ES6 模块的特点：

* 只能作为模块顶层的语句出现

* import 的模块名只能是字符串常量，不能动态引入模块

* import binding 是 immutable的，引入的模块不能再进行修改

虽然tree shaking的概念在1990就提出了，但直到ES6的ES6-style模块出现后才真正被利用起来。这是因为tree shaking只能在静态modules下工作。ECMAScript 6模块加载是静态的,因此整个依赖树可以被静态地推导出解析语法树。所以在ES6中使用tree shaking是非常容易的。而且，tree shaking不仅支持import/export级别，而且也支持statement(声明)级别。
在ES6以前，我们可以使用CommonJS引入模块：require()，这种引入是动态的，也意味着我们可以基于条件来导入需要的代码：

```js
let dynamicModule;
// 动态导入
if(condition) {
    myDynamicModule = require("foo");
} else {
    myDynamicModule = require("bar");
}
```

CommonJS的动态特性模块意味着tree shaking不适用。因为它是不可能确定哪些模块实际运行之前是需要的或者是不需要的。在ES6中，进入了完全静态的导入语法：import。这也意味着下面的导入是不可行的：

```js
// 不可行，ES6 的import是完全静态的
if(condition) {
    myDynamicModule = require("foo");
} else {
    myDynamicModule = require("bar");
}
```

只能通过导入所有的包后再进行条件获取

```js
import foo from "foo";
import bar from "bar";

if(condition) {
    // foo.xxxx
} else {
    // bar.xxx
}
```

ES6的import语法完美可以使用tree shaking, 因为可以在代码不运行的情况下就能分析出不需要的代码。

🍊 如何使用

从webpack 2开始支持实现了 Tree shaking特性，webpack 2正式版本内置支持ES2015模块（也叫做harmony模块）和未引用模块检测能力。新的webpack 4 正式版本，扩展了这个检测能力，通过packagejson的 sideEffects属性作为标记，向compiler 提供提示，表明项目中的哪些文件是“pure(纯的 ES2015 模块）”，由此可以安全地删除文件中未使用的部分。
如果使用的是webpack4,只需要将mode设置为production即可开启tree shaking

```js
entry: './src/index.js',
mode: 'production', // 设置为production模式
output: {
	path: path.resolve(__dirname, 'dist'),
	filename: 'bundle.js'
},
```

如果是使用webpack2,可能你会发现tree shaking不起作用。因shaking不支持CommonJs。所以需要配置不转义：

```js
options: { presets: [ [ 'es2015', { modules: false } ] ] }
```

🍊 关于side effects（副作用）

side effects是指那些当import的时候会执行一些动作，但是不一定会有任何export。比如ployfill,ployflls不对外暴露方法给主程序使用。
tree shaking 不能自动的识别哪些代码属于side effects，因此手动指定这些代码显得非常重要，如果不指定可能会出现一些意想不到的问题。
在webapck中，是通过package.json的sideEffects属性来实现的。

```js
{
  "name": "tree-shaking",
  "sideEffects": false
}
```

如果所有代码都不包含副作用，我们就可以简单地将该属性标记为false，来告知 webpack，它可以安全地删除未用到的export导出。
如果你的代码确实有一些副作用，那么可以改为提供一个数组：

```js
{
  "name": "tree-shaking",
  "sideEffects": [
    "./src/common/polyfill.js"
  ]
}
```

 🍊 总结

tree shaking 不支持动态导入（如CommonJS的require()语法），只支持纯静态的导入（ES6的import/export)
webpack中可以在项目package.json文件中，添加一个 "sideEffects"属性，手动制定有副作用的脚本

## Webpack的几种hash策略

🍊 hash

每个文件都具有相同的哈希值，因为它的hash是根据我们使用的所有源文件生成的。

如果重新运行该构建而不更改任何内容，则生成的hash将保持不变。

如果仅编辑一个文件，则hash值就会发生变化，并且所有生成捆绑的名称中都会包含此新的hash。

🍊 chunkhash

chunkhash是根据不同的入口进行依赖文件解析的，构建对应的chunk，生成对应的hash值.

从使用上来说：我们可以把一些公共库和程序入口文件分开来，单独打包构建，接着可以采用chunkhash方式来生成hash值，那么只要我们不改动公共库的代码，就可以保证其hash值不受影响，同时也能起到缓存的作用。

🍊 contenthash

每个生成的文件名称都有一个唯一的hash值，改hash值是根据该文件的内容计算得出

当构建的文件发生变化时，就会生成新的hash值，且该问价你的改变并不会影响和它同一个模块下的其他文件。

🍊 总结

当我们使用了hash时，并不是每次都会生成新的hash，需要具体看哪种hash策略：

1. hash是跟整个项目的构建相关，只要项目里的文件有更改，整个项目构建的hash值就会改变，并且全部文件都公用相同的hash。**粒度是整个项目。**
2. chunkhash是根据不同的入口进行依赖文件解析，构建对应的chunk（模块），生成对应的hash值。只有被修改的chunk在重新构建之后才会生成新的hash值，不会影响其他的chunk。**粒度是entry入口。**
3. contenhash是跟每个生成的文件有关，每个文件都有一个唯一的hash值。当要构建的文件内容发生改变时，就会生成新的hash值，且该文件的改变并不会影响和它同一模块下的其他文件。**粒度是每个文件。**

## Webpack对比Gulp

### webpack

webpack 是用来把你的源文件打包成一个文件的，你做了一系列配置以后，可以用一个命令 webpack 实现打包的功能。
webpack的作用是从若干个文件开始顺藤摸瓜，根据文件之间的引用关系找到所有相关文件，把他们打包到若干打包文件里。

### gulp

gulp 是用来实现自动化的，你写了一堆任务之后，可以用一个命令 gulp 执行你所需要的所有任务。用于寻找不同任务之间的依赖关系，找到正确的执行顺序，基本上什么任务都可以做，包括webpack任务。比如：将less文件转成css文件。
需要注意的是，gulp 本身，不载入任何包的话，什么事情都做不了。如果你在 gulp 里只载入了 webpack，那么此时 gulp 的作用等于webpack 的作用；如果你 gulp 里没有载入 webpack，虽然还可以由一些其它工具实现打包，但打包的方式不同于 webpack，所以此时 gulp 与 webpack 没有任何交集。而如果你的 gulp 载入了 webpack 和别的包，那么此时 gulp不但包括webpack的功能，还包括其他包的功能。

### 总结

gulp 可以拥有完整的 webpack，也可以实现相似的替代的方案，反之则不行。
gulp 强调的是前端开发的工作流程，我们可以通过配置一系列的 task，定义 task 处理的事务（例如文件压缩合并、雪碧图、启动 server、版本控制等），然后定义执行顺序，来让 gulp 执行这些 task，从而构建项目的整个前端开发流程。简单说就一个 Task Runner，模块化不是他强调的东西，他旨在规范前端开发流程。
webpack 是一个前端模块化方案，更侧重模块打包，我们可以把开发中的所有资源（图片、js 文件、css文件等）都看成模块，通过 loader （加载器） 和 plugins（插件）对资源进行处理，打包成符合生产环境部署的前端资源。webpack 更是明显强调模块化开发，而那些文件压缩合并、预处理等功能，不过是他附带的功能。

## 持久化缓存

1. 服务端设置 HTTP 缓存头 (Cache-Contro/等）
2. 打包依赖 (dependencies）和运行时（runtime）到不同 chunk（在 webpack 中，编译后的单独文件称为chunk)，即作 splitChunks，因为它们几乎是不变的。
3. 延迟加载：使用 import（）方式，可以将动态加载的文件分到独立的 chunk，以得到自己的 chunkhash
4. 保证 hash 值稳定：编译过程和文件内容的更改尽量不影响其他文件 hash 的计算。对于低版本 webpack 生成的增量数字 ID 不稳定问题，可用 `HashedModuleIdsPlugin` 基于文件路径生成解决。

## 多页面打包的原理

可以约定，src/pages 目录下，每个文件夹为单独的一个页面。每个页面至少有两个文件配置：

1. app.js： 页面逻辑入口
2. index.html 页面的 html 模板

🍊 如何将每个页面看做是一个独立的单页应用进行打包呢？

这时可以通过配置 webpack 的 entry，多页应用只需配置多个 entry 即可。

```js
module.exports = {
  entry: {
    page1: "./src/pages/page1/app.js", // 页面1
    page2: "./src/pages/pages/app.js", // 页面2
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "js/[name]/[name]-bundle.js",
  },
};
```

因为多个活动有多个模板，所以可以配置多个 HtmIWebpackPlugin

> 注意：HtmlWebpackPlugin 一定要配 chunks，否则所有页面的js 都会被注入到当前 html 里 

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      templage: "./src/pages/page1/index.html",
      chunks: ["page1"],
    }),
    new HtmlWebpackPlugin({
      templage: "./src/pages/page2/index.html",
      chunks: ["page2"],
    }),
    new HtmlWebpackPlugin({
      templage: "./src/pages/page3/index.html",
      chunks: ["page3"],
    }),
  ],
};

```

## webpack是如何处理模块循环引用的？

> webpack与node的循环引用处理原理相同。利用installedModules缓存已加载模块的exports，通过读取缓存的exports避免再次执行。

__webpack_require__ 做了如下几件事：

1. 根据moduleId查看installedModules中是否存在对应的module，如果存在就返回对应的module.exprots；
2. 如果module不存在，就创建一个新的module对象，并且使installedModules`[moduleId]`指向新建的 module 对象；
3. 根据moduleId从module对象中找到对应的模块初始化函数并执行，一次传入module、 module.exports、`__webpack_require__`。可以看到`__webpack_require__`被当做参数传入，使得所有模块内部都可以通过调用该函数来引入其他模块。
4. 最后一步，返回一个module.exports

具体代码逻辑如下：

1. a.js脚本先输出一个done变量，饭后加载另一个脚本文件b.js；
2. `b.js`执行到第二行，就会去加载`a.js`，这时，就发生了“循环加载”。系统会去`a.js`模块对应对象的`exports`属性取值，可是因为`a.js`还没有执行完，从`exports`属性只能取回已经执行的部分，而不是最后的值。 `a.js` 执行了一行，返回一个变量 done，值为 false；
3. `b.js`接着往下执行，等到全部执行完毕，再把执行权交还给`a.js`
4. `a.js`接着往下执行，直到执行完毕。

运行结果为：

```javascript
在 b.js 之中，a.done = false
b.js 执行完毕
在 a.js 之中，b.done = true
a.js 执行完毕
在 main.js 之中, a.done=true, b.done=true
```

总结：

webpack遇到模块循环引用是，返回的是当前已经执行部分的值，而不是代码全部执行后的值，两者可能会有差异；

webpack的模块模式是基于CommonJS模式的，输入的是被输出值的拷贝，而不是引用。

## Webpack 热更新的原理

🍊 原理

1. 启动阶段

Webpack Compiler 将对应文件打包成bundle.js(包含注入的HMR Server)，发送给Bundler Server
浏览器即可以访问服务器的方式获取bundlejs

2. 更新阶段（即文件发生了变化）

1. Webpack Compiler 重新编译，发送给HMR Server
2. HMR Server 可以知道有哪些资源、哪些模块发生了变化，通知HRM Runtime
3. HRM Runtime更新代码

🍊 流程

* 使用webpack-dev-server去启动本地服务，内部实现主要使用了webpack、 express、 websocket。
* 使用express启动本地服务，当浏览器访问资源时对此做响应。
* 服务端和客户端使用websocket实现长连接
* webpack监听源文件的变化，即当开发者保存文件时触发webpack的重新编译。
  * 每次编译都会生成hash值、已改动模块的json文件、已改动模块代码的js文件
  * 编译完成后通过socket向客户端推送当前编译的hash戳
* 客户端的websocket监听到有文件改动推送过来的hash戳，会和上一次对比
  * 一致则走缓存
  * 不一致则通过ajax和isonp向服务端获取最新资源
* 使用内存文件系统去替换有修改的内容实现局部刷新

🍊 1.server端

* 启动webpack-dev-server服务器
* 创建webpack实例
* 创建Server服务器
* 添加webpack的done事件回调
* 编译完成向客户端发送消息
* 创建express应用app
* 设置文件系统为内存文件系统
* 添加webpack-dev-middleware中间件
* 中间件负责返回生成的文件
* 启动webpack编译
* 创建http服务器并启动服务
* 使用sockjs在浏览器端和服务端之间建立一个 websocket 长连接
* 创建socket服务器

🍊 2.client端

* webpack-dev-server/client端会监听到此hash消息

* 客户端收到ok的消息后会执行reloadApp方法进行更新

* 在reloadApp中会进行判断，是否支持热更新，如果支持的话发射webpackHotUpdate事件，如果不支持则直接刷新浏览器

* 在webpack/hot/dev-serverjs会监听webpackHotUpdate 事件

* 在check方法里会调用module.hot.check方法

* HotModuleReplacement.runtime请求Manifest

* 它通过调用 JsonpMainTemplate.runtime的hotDownloadManifest方法

* 调用JsonpMain Template.runtime的hotDownloadUpdateChunk方法通过JSONP请求获取到最新的模块代码

* 补丁JS取回来后会调用JsonpMainTemplate.runtime.js的webpackHotUpdate方法

* 然后会调用HotModuleReplacement.runtime.js的hotAddUpdateChunk方法动态更新模块代码

* 然后调用hotApply方法进行热更新

🍊 开发环境热更新的优化方式

其实就是优化开发环境打包时间

在此之前，我们需要有一个量化的指标证明我们做的是有意义的。`speed-measure-webpack-plugin`可以测量各个插件和loader的使用时间，量化指标。

1. 关闭文件名 hash 功能
2. 关闭压缩功能
3. 如果必须使用 source-map，选择 eval 或 eval-cheap-source-map 速度更快
4. 使用多线程：如` thread-loader`。另外对于有类型检查的语言（如TypeScript)，将类型检查与代码编译分到不同线程执行（如`fork-ts-checker-webpack-plugin`)，虽然关闭检查可能更快，但是不建议这么做
5. 开启缓存：如` cache-loader`、 `ard-source-webpack-plugin `等

## webpack5

### 🍊 构建优化

#### tree-shaking

- `内部模块tree-shaking`

  Webpack 5 有一个新的选项 optimization.innerGraph，在生产模式下是默认启用的，它可以对模块中的标志进行分析，找出导出和引用之间的依赖关系。

- `嵌套的tree-shaking`

  Webpack能够跟踪对导出的嵌套属性的访问，因此可以改善重新导出命名空间对象时的 Tree Shaking（

- `CommonJs Tree Shaking`

  Webpack 5 增加了对一些 CommonJs 构造的支持，允许消除未使用的 CommonJs 导出，并从 require() 调用中跟踪引用的导出名称

#### 代码块拆分与模块大小

- 支持对模块按照大小进行拆分
- SplitChunksPlugin 插件知道如何处理这些不同模块的大小，并为它们设置 minSize 和 maxSize

```js
module.exports = {

    optimization: {

        splitChunks: {

            minSize: {

            javascript: 30000,

            webassembly: 50000,

            },
        },
    },

};
```

### 🍊 性能优化

### 持久缓存

有一个`文件系统缓存`，它是`可选的`, 配置如下：

```js
module.exports = {

cache: {

// 1. 将缓存类型设置为文件系统

type: 'filesystem',

buildDependencies: {

// 2. 将你的config 添加为 buildDependency，以便在改变 config 时获得缓存

config: [__filename],

// 3. 如果有其他的东西需要被构建依赖，可以在这里添加它们

// 注意，webpack、加载器和所有从你的配置中引用的模块都会被自动添加

},},

};
```

持久性缓存将根据使用情况自动创建多个缓存文件，以优化对缓存的读写访问。默认情况下，时间戳将用于开发模式的快照，而文件哈希将用于生产模式。文件哈希也允许在 CI 中使用持久性缓存

### 🍊 长期缓存的优化

新增了长期缓存的算法，生产模式下是默认启用的，如下：

```js
chunkIds: "deterministic" 
moduleIds: "deterministic"
moduleIds: "deterministic"
```

### 联邦模块

它本身是webpack的一个插件`ModuleFederationPlugin`，主要是为更大型的前端应用提供了开箱解决方案，被webpack给内置了，是继Externals后最终的运行时代复用解决方案。

1. `name` 当前应用名称，需要全局唯一。

2. `remotes` 可以将其他项目的 `name` 映射到当前项目中。

3. `exposes` 表示导出的模块，只有在此申明的模块才可以作为远程依赖被使用。

4. `shared` 是非常重要的参数，制定了这个参数，可以让远程加载的模块对应依赖改为使用本地项目的 React 或 ReactDOM。

### 对Web平台功能的新支持

##### 1. JSON模块

1. 使用自定义的JSON解析器：Rule.parser.parse中指定；
2. 未使用的属性也会被optimization.usedExports优化丢弃；
3. 属性会被 optimization.mangleExports 优化打乱；

##### 2. ProgressPlugin插件的优化

不仅可以统计模块编译的进度，也可以统计 入口 和 依赖

##### 3. 自动添加唯一命名

Webpack 4 中，**多个Webpack同时运行**时可能会在同一个 HTML 页面上**发生冲突**,这时候会在**output.jsonpFunction**配置提供一个自定义的，**Webpack 5** 会从 package.json name 中自动推断出一个唯一的构建名称，并将其作为 output.uniqueName 的默认值，可将output.jsonpFunction删除

##### 4. Typescript 类型

Webpack 5 可以从源码中生成 typescript 类型，并通过 npm 包暴露它们

## 打包工具如何选择

grunt

- 通过Gruntfile配置完成后，可以实现自动化。在执行缩小，编译，单元测试，测试等重复性任 务。虽然grunt看似已垂垂老矣，但是以前写的很多项目一直用的就是grunt，温故方能知新。

gulp

- Gulp是一个基于流的自动化构建工具。除了可以管理和执行任务，还支持监听文件、读写文件

webpack

- Webpack是一个打包模块化JavaScript的工具，在Webpack里一切文件皆模块，通过Loader转 换文件，通过Plugin注入钩子，最后输出由多个模块组合成的文件。Webpack专注于构建模块化 项目。

rollup

- Rollup是一个和Webpack很类似但专注于ES6的模块打包工具。它的亮点在于，能针对ES6源码 进行Tree Shaking，以去除那些已被定义但没被使用的代码并进行Scope Hoisting，以减小输出 文件的大小和提升运行性能。然而Rollup的这些亮点随后就被Webpack模仿和实现。不支持 Code Spliting，但打包出来的代码更小、更快。

fis

- FIS称自己是可能是史上最强大的前端工程化方案，其实也是不无道理的。因为它不但解决前端 开发中自动化工具、性能优化、模块化框架、开发规范、代码部署、开发流程等问题还有一套完 整的后端解决方案。但是此项目在百度内部，且维护成本不高已看衰。不过它的经典前端工程化 的思想完全能够让我们进行借鉴。

parcel

- Parccel已快速打包、自动转换、零配置代码拆分、支持模块热替换和友好的错误记录迅速火 热，但也被Webpack4抄袭未来怎么样，拭目以待。