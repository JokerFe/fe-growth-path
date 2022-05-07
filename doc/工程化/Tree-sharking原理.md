#  tree-shaking 的原理

当前端项目到达一定的规模后，我们一般会采用按模块方式组织代码，这样可以方便代码的组织及维护。但会存在一个问题， 比如我们有一个utils工具类，在另一个模块中导入它。这会在打包的时候将utils中不必要的代码也打包，从而使得打包体积变大，这时候就需要用到Tree shaking技术了。
Tree shaking 是一种通过清除多余代码方式来优化项目打包体积的技术，专业术语叫`Dead code elimination`

## 原理

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

#### 如何使用

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

#### 关于side effects（副作用）

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

#### 总结

tree shaking 不支持动态导入（如CommonJS的require()语法），只支持纯静态的导入（ES6的import/export)
webpack中可以在项目package.json文件中，添加一个 "sideEffects"属性，手动制定有副作用的脚本