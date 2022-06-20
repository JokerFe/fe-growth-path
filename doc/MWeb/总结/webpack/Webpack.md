# Webpack

## 为什么要用Webpack？

#### 网页中的静态资源有哪些？

* js	`.js  .jsx  .ts`

* css`.css  .less  .sass  .scss `

* img`.jpg  .png  .gif  .bmp  .svg `

* fonts`.svg  .ttf  .eot  .woff `

* 模板文件`.ejs  .jade  .vue`

#### 网页引入过多静态资源的问题与解决方式

##### 问题

* 网页加载速度慢，因为要发起很多二次请求

* 要处理错综复杂的依赖关系

##### 方案

* 合并、压缩、雪碧图、图片的Base64编码

* 使用requireJS或者webpack可以解决各个包之间的复杂依赖关系

#### 完美解决方案

1. 使用Gulp，基于task任务进行的；
   * 小巧灵活，方便小项目的使用。
2. 使用webpack，基于整个项目进行构建的；
   * 借助于webpack这个前端自动化构建工具，可以完美实现资源的合并、打包、压缩、混淆等诸多功能。

#### 为什么要使用webpack

现今的很多网页其实可以看做是功能丰富的应用，它们拥有着复杂的JavaScript代码和一大堆依赖包。为了简化开发的复杂度，前端社区涌现出了很多好的实践方法

- **模块化**，让我们可以把复杂的程序细化为小的文件;
- 类似于TypeScript这种在JavaScript基础上拓展的开发语言：使我们能够实现目前版本的JavaScript不能直接使用的特性，并且之后还能转换为JavaScript文件使浏览器可以识别；
- Scss，less等CSS预处理器
- ...

这些改进确实大大的提高了我们的开发效率，但是利用它们开发的文件往往需要进行额外的处理才能让浏览器识别,而手动处理又是非常繁琐的，这就为WebPack类的工具的出现提供了需求。

#### 什么是Webpack

WebPack可以看做是**模块打包机**：它做的事情是，分析你的项目结构，找到JavaScript模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其转换和打包为合适的格式供浏览器使用。

## 使用

### 安装

通过npm命令进行安装

```nginx
# 全局安装
$ npm install webpack -g
# 安装到项目中
$ npm install webpack --save-dev
```

### 基本使用

##### 语法

在入口js文件中使用`import`的方式引入js文件，避免在html文件中通过`script`、`link`引入过多的文件，造成页面请求过多而影响性能。这个引用方式是ES6的新语法，使用起来比较方便，但是浏览器不识别，所以通过webpack等前端构建工具，将入口文件就行处理。

```nginx
$ webpack 目标文件名 处理后的文件名
```

##### webpcak的作用

* 能够处理js文件的相互依赖关系
* 能够处理js的兼容问题，把高级的、浏览器不识别的语法，转为低级的、浏览器识别的语法

##### 配置文件的设置

由于`webpack`是基于`Node`进行构建的，所有`webpack`的配置文件中，任何合法的`Node`代码都是支持的。

Webpack拥有很多其他的比较高级的功能（比如说loader、plugins和强大的Source Map），这些功能其实都可以通过命令行模式实现，但是这样不太方便并且容易出错，所以更好的办法就是通过配置文件将所有的与打包相关的信息放在里面。

当我们以命令行的形式运行`webpack`或`webpack-dev-server`的时候，工具会发现，我们并没有提供要打包的文件的入口和出口文件，此时，他会检查项目根目录中的配置文件，并读取这个文件，就拿到了导出这个配置对象，然后根据这个对象进行打包构建。

首先，要在文件根目录下创建一个名为`webpack.config.js`的配置文件，在里边就可以写入所有的与打包相关的信息。

```javascript
// webpack.config.js
module.exports = {
    entry:'',	// 入口文件路径
    output:{},	// 输出文件路径和名称
    module:{},	// 所有loader的匹配规则
    plugins:[],	// 所有插件的配置节点
}
```

### loader配置

loader用于对模块的源代码进行转换。loader可以使你在`import`或者“加载”模块时预处理文件。因此，loader类似于其他构件工具中的“任务(task)”，并提供了处理前端构件步骤的强大方法。loader可以将文件从不同的语言（TypeScript）转换为JavaScript，或将内联图形转换为data URL（图片的路径）。loader甚至允许你直接在JavaScript模块中`import`CSS文件。

##### loader的特性

* loader支持链式传递。能够对资源使用流水线（pipeline）。一组链式的loader将按照想法的顺序执行，loader链中的第一个loader返回值给下一个loader。最后一个loader返回webpack所预期的JavaScript。
* loader可以是同步的，也可以是异步的。
* loader运行在Node.js中，并且能够执行任何可能的操作。
* loader接收查询参数。用于对loader传递配置。
* loader也能够使用options对象进行配置。
* 除了使用`package.json`产检的main属性，还可以将普通的npm模块导出为loader，做法是在`package.json`里定义一个loader字段。
* 插件可以为loader带来更对特性。
* loader能够产生额外的任意文件。

##### 解析loader

loader遵循标准的[模块解析](https://www.webpackjs.com/concepts/module-resolution/)。多数情况下，loader将从模块路径解析。

loader模块需要导出为一个函数，并且使用Node.js兼容的JavaScript编写。通常使用npm进行管理，但是也可以将自定义loader作为应用程序中的文件。按照约定，loader通常被命名为`xxx-loader`。

##### loader的基本使用

例如，我们要使用webpack处理css文件，就要安装相对应的loader：

```nginx
npm install --save-dev style-loader
npm install --save-dev css-loader
```

然后告诉webpack要使用这两个loader对那些css文件进行处理（一般对css文件处理时都需要使用这两个loader），那么就在webpack.config.js中进行配置：

```javascript
module.export = {
	module:{
        rules:[
            {test:/\.css$/,use:['style-loader','css-loader']}
        ]
	}
}
```

##### loader的配置

`module.rules`允许在webpcak配置中指定多个loader，同时允许对单个匹配到的文件使用多个loader，并且允许对这些loader添加指定的配置属性（，具体的配置属性依赖于各自的loader设置）：

```javascript
module.export = {
	module:{
        rules:[
            {
            	test:/\.css$/,
            	use:[
                    {loader:'style-loader'},
                    {
                    	loader:'css-loader',
                     	options:{
                            modules:ture
                     	}
                     }
            	]
             }
        ]
	}
}
```

### plugins配置

插件是webpack的**支柱功能**。webpack自身也是构建于在配置中用到的**相同的插件系统**之上。插件的目的在于解决loader无法实现的其他事。

##### 用法

由于插件可以携带参数/选项，所以必须在webpack配置中向`plugins`属性传入`new`。

```javascript
const path = require("path");
// 在内存中，根据指定的模板页面生成一份在内存中的首页，同时自动把打包好的bundle注入到页面底部
const htmlwebpackplugin = require("html-webpack-plugin");
// 如果要配置插件，需要在到处对象中注入 plugins数组 节点
const webpack = require("webpack");

module.exports = {
    entry:path.resolve(__dirname,"./src/app.js"),
    output:{
       path:path.resolve(__dirname,"./dist/app.js"),
       filename:'bundle.min.js'
    },
    plugins:[ 
        // webpack所有插件的配置节点，每个插件都是一个对象
        new htmlwebpackplugin({
            template:path.resolve(__dirname,'./src/index.html'),// 指定模板文件路径
            filename:'index.html',// 设置生成的内存页面的名称
        }),
        new webpack.optimize.UglifyJsPlugin()
    ]
}
```

### 输出文件

webpack打包出来的结果其实就是一个闭包，内容是以js文件路径为key，具体内容为value的Object对象。当我们打包后js文件如下示例：

```javascript
(function(modules){
  var installedModules = {}
  function __webpack_rquire__(moduleId){
    // 1. 判断缓存中有没
    // 2. 没有缓存就创建一个
    // 3. 然后通过call执行，绑定this
  }
  return __webpack_rquire__('./src/index.js')
})({
    './src/index.js':(function(modules,exports){
        eval(console.log("webpack logs"))
    })
})
```

## 原理解析

#### 你不知道的modules

##### 开启多核编译

Webpack是基于NodeJS的，所以可以开启多核编译，通过`HappyPack`的插件。

```javascript
const HappyPack = require("happypack");
const os = requier("os");
// 开辟一个线程池
const happyTreadPoll = HappyPack.TreadPoll({size:os.cpus().lenght});
modules.exports.plugins=[
    new HappyPack({
        id:"babel",
        treadPool:happyTreadPoll,
        loader:[
            {loader:'babel-loader'}
        ]
    })
];
```

##### AST静态语法分析树🌲

在计算机科学中，抽象语法树（abstract syntax tree 或者缩写为AST），或者语法树（syntax tree），是源代码的抽象语法结构的树状表现形式，这里特指编程语言的源代码。树上的每个节点都表示源代码中的一种结构。之所以说语法是**抽象**的，是因为这里的语法并不会表现出真实语法中出现的每个细节。

Webpack提供的一个很大的便利就是能将所有的资源整合成模块，不仅仅是js文件。所以需要一些loader，比如url-loader等等来让我们可以直接在源文件中引用各类资源。最后调用acorn（Esprima）解析经loader处理后的源文件生成抽象语法树AST。下面是AST语法分析树的结构分析：

当我们声明一个变量时，会使用如下代码：

```javascript
 var AST = "is Tree";
```

当我们通过AST进行分析后会得到如下结果：

```javascript
 {
     "type":"Program",
     "body":[{
         "type":"VariableDeclaration",
         "kind":"var",
         "declarations":[{
             "type":"VariableDeclaration",
             "id":{
                 "type":"Identifier",
                 "name":"AST"
             },
             "init":{
                 "type:"Literal",
                 "value":"is tree",
                 "raw":"\"is tree\""
             }
         }]
     }]
 }
```

结构解析如下：

* type：描述该语句的类型 -- 变量声明语句
* kind：变量声明的关键字 -- var
* declaration：声明的内容数组，里面的每一项也是一个对象
  * type：描述该语句的类型
  * id：描述变量名称的对象
    * type：定义
    * name：变量的名称
  * init：初始化变量值的对象
    * type：类型
    * value：值，不带引号
    * raw：值，带引号

##### loader原理

因为每个loader在处理的时候都会经过`string -> ast -> string`，有多少个loader都会经过多少次这个过程，这也是webpack编译慢的一个最主要原因。

loader的主要作用就是帮你找到相应的文件，然后交给对应的插件来通过处理这些内容。