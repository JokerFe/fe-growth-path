# Webpack 里面的插件是怎么实现的

[toc]

## webpack 插件分析

>  插件目的在于解决 loader 无法实现的其他事。
> 通过插件我们可以扩展 webpack，在合适的时机通过 Webpack 提供的 API 改变输出结果，使 webpack 可以执行更广泛的任务，拥有更强的构建能力。

#### webpack 插件机制关键的知识点

* 一个简单插件的构成

* webpack 构建流程

* Tabable 是如何把各个插件串联到一起的

* compiler 以及 compilation 对象的使用以及它们对应的事件钩子

### 一、 插件基本结构

plugins 是可以用自身原型方法 apply 来实例化的对象。apply 只在安装插件被 Webpack compiler 执行一次。apply 方法传入一个 webpck compiler 的引用，来访问编译器
回调。

##### 插件示例

```js
// 插件名字
const pluginName = "PluginExample";

class PluginExample {
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options) {}
  // Webpack 会调用 PluginExample 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {
    // 在emit阶段插入钩子函数，用于特定时机处理额外的逻辑；
    compiler.hooks.emit.tap("HelloPlugin", (compilation) => {
      // 在功能流程完成后可以调用 webpack 提供的回调函数；
    });
    // 如果事件是异步的，会带两个参数，第二个参数为回调函数，在插件处理完任务时需要调用回调函数通知webpack，才会进入下一个处理流程。
    compiler.plugin("emit", function (compilation, callback) {
      // 支持处理逻辑
      // 处理完毕后执行 callback 以通知 Webpack
      // 如果不执行 callback，运行流程将会一直卡在这不往下执行
      callback();
    });
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin;
```

##### 插件使用

```js
// webpack 配置文件中
const PluginExample = require('./PluginExample');
module.exports = {
  plugins:[
    new PluginExample({options:true});
  ]
}
```

##### 流程：

1. 读取配置的过程中会先执行 new PluginBxample(fopt ions:true}）；初始化一个 PluginExample 获得其实例。

2. 初始化 comiler 对象后调用 PluginExample. apply(compiler）个插件实例传入 compiler 对象。
3. 插件实例在获取到 compiler 对象后，就可以通过提供的事件钩子来进行相应的操作。

##### 总结：

1. webpack 本质是一种事件流机制，核心模块：tapable (Sync + Async)Hooks 构造出=> Compiler(编译）+ Compilation(创建 bundles)
2. compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options， loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。
3. compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。
4. 创建一个插件函数，在其 prototype 上定义 apply 方法，指定一个绑定到 webpack 自身的事件钩子；
5. 函数内,处理 webpack 内部实例的特定数据
6. 处理完成后，调用 webpack 提供的回调

### 二、webpack 构建流程

校验配置文件读取命令行传入或者 webpack.config.js 文件，初始化本次构建的配置参数

1. 生成 Compiler 对象：执行配置文件中的插件实例化语句 new MyWebpackPlugin(），为 webpack 事件流挂上自定义 hooks
2. 进入 entryOption 阶段：webpack 开始读取配置的 Entries，递归遍历所有的入口文件
3. run/watch：如果运行在 watch 模式则执行 watch 方法，否则执行 run 方法
4. compilation：创建 Compilation 对象回调 compilation 相关钩子，依次进入每一个入口文件(entry)，使用 loader 对文件进行编译。通过 compilation 我可以可以读取到 module 的 resource（资
    源路径）、loaders（使用的 loader) 等信息。再将编译好的文件内容使用 acorn 解析生成 AST 静态语法树。然后递归、重复的执行这个过程，所有模块和和依赖分析完成后，执行 compilation 的
    seal 方法对每个 chunk 进行整理、优化、封装**webpack_require**来模拟模块化操作。
5. emit：所有文件的编译及转化都己经完成，包含了最终输出的资源，我们可以在传入事件回调的 compilation.assets 上拿到所需数据，其中包括即将输出的资源、代码块 Chunk 等等信息。

```js
// 修改或添加资源
compilation.assets["new-file.js"] = {
  source() {
    return "var a=1";
  },
  size() {
    return this.source().length;
  },
};
```

![webpack-process](../../imgs/工程化/webpack-process.png)

### 三、 事件流机制 Tapable

webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable。
Webpack 的 Tapable 事件流机制保证了插件的有序性，将各个插件串联起来，Webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条 webapck 机制中，去改变 webapck 的运作，使得整个系统扩展性良好。
Tapable 也是一个小型的 Tibrary，是 Webpack 的一个核心工具。类似于 node 中的 events 库，核心原理就是一个订阅发布模式。作用是提供类似的插件接口。
webpack 中最核心的负责编译的 Compiler 和负责创建 bundles 的 Compilation 都是 Tapable 的实例，可以直接在 Compiler 和 Compilation 对象上广播和监听事件。

方法如下：

```js
/**
 * 广播事件
 * event-name 为事件名称，注意不要和现有的事件重名
 */
compiler.apply("event-name", params);
compilation.apply("event-name", params);
/**
 * 监听事件
 */
compiler.plugin("event-name", function (params) {});
compilation.plugin("event-name", function (params) {});
```

Tapable 类暴露了 tap、 tapAsync 和 tapPromise 方法，可以根据钩子的同步/异步方式来选择一个函数注入逻辑。

* tap 同步钩子

```js
compiler.hooks.compile.tap("MyPlugin", (params) => {
  console.log("以同步方式触及 compile 钩子。");
});
```

* tapAsync 异步钩子，通过 calback 回调告诉 Webpack 异步执行完毕

* tapPromise 异步钩子，返回一个 Promise 告诉 Webpack 异步执行完毕

```js
compiler.hooks.run.tapAsync("MyPlugin", (compiler, callback) => {
  console.log("以异步方式触及 run 钩子。");
  callback();
});

compiler.hooks.run.tapPromise("MyPlugin", (compiler) => {
  return new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
    console.log("以具有延迟的异步方式触及 run 钩子");
  });
});
```

### 四、 Compiler

开发插件必须了解 compiler 以及 compilation 对象是做什么的。
compiler 这个对象包含了 webpack 环境所有的的配置信息，包含 options, loaders，plugins 这些信息，这个对象在 webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 webpack 实例。
为了在指定生命周期做自定义的一些逻辑处理，我们需要在 compiler 暴露的钩子上指明我们的 tap 配置，一般这由一个字符串命名和一个回调函数组成。一般来说，compile 过程中会触发如下几个钩子：

* beforeRun

* beforeCompile

* compile

* make

* seal

* emit

* ....更多可以查看官方文档

### 五、 Compilation

compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 compilation 将被创建。compilation 对象也提供了很多事件回调供插件做扩展。通过 compilation 也能读取到 compiler 对象。两者的区别在于，前者代表了整个 webpack 从启动到关闭的生命周期，而 compilation 只代表一次单独的编译。
compilation 也对应有不同的钩子给开发者调用

```js
compilation.hooks.someHook.tap(/* ... */);
```

几个常用的 Compilation 钩子

* buildModule:在模块构建开始之前触发，可以用来修改模块。

* succeedModule:当一个模块被成功编译，会执行这个钩子。

* finishModules:当所有模块都编译成功后被调用

* seal当一次 compilation 停止接收新模块时触发

* optimizeDependencies:在依赖优化的开始执行

* optimize:在优化阶段的开始执行

* optimizeModules：在模块优化阶段开始时执行，插件可以在这个钩子里执行对模块的优化

* optimizeChunks：在代码块优化阶段开始时执行，插件可以在这个钩子里执行对代码块的优化

* optimizeChunkAssets：优化任何代码块资源，这些资源存放在 compllation.assets 上。一个 chunk 有一个 fles 属性，它指向由一个 chunk 创建的所有文件。任何额外的

* chunk 资源都存放在 compilation.additionalChunkAssets 上。

* optimizeAssets：优化所有存放在 compilation.assets 的所有资源。回调参数：assets

### 六、 Compiler 和 Compilation 的区别

Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Complation 只是代表了一次新的编译，只要文件有改动，compilation 就会被重新创建。

## 常用 API

插件可以用来修改输出文件、增加输出文件、甚至可以提升 Webpack 性能、等等，总之插件通过调用 Webpack 提供的 API 能完成很多事情。来看一下常用的 APl。

### 一、 读取输出资源、代码块、模块及其依赖

有些插件可能需要读取 Webpeck 的处理结果，例如输出资源、代码块、模块及其依赖，以便做下一步处理。
在emit 事件发生时，代表源文件的转换和组装已经完成，在这里可以读取到最终将输出的资源、代码块、模块及其依赖，并且可以修改输出资源的内容。

```js
class Plugin {
  apply(compiler) {
    compiler.plugin("emit", function (compilation, callback) {
      // compilation.chunks 存放所有代码块，是一个数组
      compilation.chunks.forEach(function (chunk) {
        // chunk 代表一个代码块
        // 代码块由多个模块组成，通过 chunk.forEachModule 能读取组成代码块的每个模块
        chunk.forEachModule(function (module) {
          // module 代表一个模块
          // module.fileDependencies 存放当前模块的所有依赖的文件路径，是一个数组
          module.fileDependencies.forEach(function (filepath) {});
        });

        // Webpack 会根据 Chunk 去生成输出的文件资源，每个 Chunk 都对应一个及其以上的输出文件
        // 例如在 Chunk 中包含了 CSS 模块并且使用了 ExtractTextPlugin 时，
        // 该 Chunk 就会生成 .js 和 .css 两个文件
        chunk.files.forEach(function (filename) {
          // compilation.assets 存放当前所有即将输出的资源
          // 调用一个输出资源的 source() 方法能获取到输出资源的内容
          let source = compilation.assets[filename].source();
        });
      });

      // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
      // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行。
      callback();
    });
  }
}
```

### 二、监听文件变化

Webpack 会从配置的入口模块出发，依次找出所有的依赖模块，当入口模块或者其依赖的模块发生变化时，就会触发一次新的 Compilation.
在开发插件时经常需要知道是哪个文件发生变化导致了新的 Compilation，为此可以使用如下代码：

```js
// 当依赖的文件发生变化时会触发 watch-run 事件
compiler.hooks.watchRun.tap("MyPlugin", (watching, callback) => {
  // 获取发生变化的文件列表
  const changedFiles = watching.compiler.watchFileSystem.watcher.mtimes;
  // changedFiles 格式为键值对，键为发生变化的文件路径。
  if (changedFiles[filePath] !== undefined) {
    // filePath 对应的文件发生了变化
  }
  callback();
});
```

默认情况下 Webpack 只会监视入口和其依赖的模块是否发生变化，在有些情况下项目可能需要引入新的文件，例如引入一个 HTML 文件。由于 JavaScript 文件不会去导入HTML 文件，Webpack 就不会监听 HTML 文件的变化，编辑 HTML 文件时就不会重新触发新的 Compilation。为了监听 HTML 文件的变化，我们需要把 HTML 文件加入到依赖列表中，为此可以使用如下代码：

```js
compiler.hooks.afterCompile.tap("MyPlugin", (compilation, callback) => {
  // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
  compilation.fileDependencies.push(filePath);
  callback();
});
```

### 三、 修改输出资源

有些场景下福件需要修改、增加、即除输出的资源，要做到这点需要监听 ernt 事件，因为发生 gmnt 事件时所有模换的辣换和代码块对应的文件已经生成好，需要输出的资源即将输出，因此 emit 事件是修改 Webpack 输出资源的最后时机。
所有需要输出的资源会存放在 compilation.assets 中，complation.assets 是一个键值对，键为需要输出的文件名称，值为文件对应的内容。

```js
// 设置名称为 fileName 的输出资源
compilation.assets[fileName] = {
  // 返回文件内容
  source: () => {
    // fileContent 既可以是代表文本文件的字符串，也可以是代表二进制文件的 Buffer
    return fileContent;
  },
  // 返回文件大小
  size: () => {
    return Buffer.byteLength(fileContent, "utf8");
  },
};
callback();
```

### 四、判断 Webpack 使用了哪些插件

```js
// 判断当前配置使用使用了 ExtractTextPlugin，
// compiler 参数即为 Webpack 在 apply(compiler) 中传入的参数
function hasExtractTextPlugin(compiler) {
  // 当前配置所有使用的插件列表
  const plugins = compiler.options.plugins;
  // 去 plugins 中寻找有没有 ExtractTextPlugin 的实例
  return (
    plugins.find(
      (plugin) => plugin.__proto__.constructor === ExtractTextPlugin
    ) != null
  );
}
```

### 五、管理 Warnings 和 Errors

如果你在 apply 函数内插入 throw new Error("Message”），会发生什么，终端会打印出 Unhandled rejection Error：Message。然后 webpack 中断执行。为了不影响 webpack 的执行，要在编译期间向用户发出警告或错误消息，则应使用 compilation.warnings 和 compilation.errors。

```js
compilation.warnings.push("warning");
compilation.errors.push("error");
```

