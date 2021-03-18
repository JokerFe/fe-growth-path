# WebAssembly

> WebAssembly 或者 wasm 是一个可移植、体积小、加载快并且兼容 Web 的全新格式

## 简介

WebAssembly是一种运行在现代网络浏览器中的新型代码，并且提供新的性能特性和效果。它设计的目的不是为了手写代码而是为诸如C、C++和Rust等低级源语言提供一个高效的编译目标。对于前端来说，它能让客户端APP提供了一种在网络平台以接近本地运行多种编写语言的代码形式，并且性能达到本地原生性能。

例如我们使用c++、C、Rust等语言去编写，然后编译成WASM，丢给浏览器去运行，而浏览器会将它当成一个模块去运行。但是它的使用场合还是比较局限的，针对于前端来说，我们使用JavaScript去编写已经是足够了。但当我们对某些内容性能要求非常高的时候，比如说一些游戏、绘制比较复杂的canvas时它背后复杂的计算逻辑（它会拖慢图形绘制的界面）等场景是可以使用WebAssembly来提高性能。

## 特点

#### 高效

WebAssembly有一套完整的语义，实际上WebAssembly是体积小且加载快的二进制格式，其目标就是充分发挥硬件能力以达到原生执行效率。

#### 安全

WebAssembly 运行在一个沙箱化的[执行环境](https://www.wasm.com.cn/docs/semantics/#linear-memory)中，甚至可以在现有的 JavaScript 虚拟机中实现。在[web环境中](https://www.wasm.com.cn/docs/web/)，WebAssembly将会严格遵守同源策略以及浏览器安全策略。

#### 开发

WebAssembly是一门低阶语言，设计了一个非常规整的文本格式用来调试、测试、实验、优化、学习、教学或者编写程序。可以以这种文本格式在web页面上查看WebAssembly模块的源码。

#### 标准

WebAssembly在web中被设计成无版本、特性可测试、向后兼容的。WebAssembly可以被JavaScript调用，进行JavaScript的上下文，也可以想Web API一样调用浏览器的功能。当然，WebAssembly不仅可以运行在浏览器上，也可以运行在非web环境下。

## WebAssembly关键概念

为了理解WebAssembly如何在浏览器中运行，需要了接几个概念。

#### 模块

表示一个已经被浏览器编译为可执行机器码的WebAssembly二进制代码。一个模块是无状态的，并且像一个二进制对象`Blob`一样能够被缓存带IndexDB中或者在windows和works之间进行共享（通过postMessage()函数）。一个模块能够像一个ES2015的模块一样声明导入和导出。

#### 内存

ArrayBuffer，大小可变。本质上是连续的字节数组，WebAssembly的低级内存存取指令可以对它进行读写操作。

#### 表格

带类型数组，大小可变。表格中的项存储了不能作为原始字节存储在内存里的对象的引用，为了安全和可移植性的原因。

#### 实例

一个模块及其在运行时使用的所有状态，包括内存、表格和一系列导入值。一个示例就像一个已经被加载到一个拥有一组特定的全局变量的ES2015模块。

JavaScriptAPI为开发者提供了创建模块、内存、表格和实例的能力。给定一个WebAssembly实例，JavaScript代码能够调用普通JavaScript函数暴露出来的代码。通过把JavaScript函数导入到WebAssembly实例中，任意的JavaScript函数都能被WebAssembly代码同步调用。

因为JavaScript能够完全控制WebAssembly代码如何下载、编译运行，所以JavaScript开发可以把WebAssembly当成一个高效地生成高性能函数的JavaScript特性。

##  底层的机制和原理

![](/Users/guohaohao3/Documents/Joker/Git/fe-growth-path/doc/V8/wasm/WebAssembly1.png)

从上图的浏览器中执行流程可以看出来，WebAssembly的代码执行过程比js的执行过程短。

在V8引擎中js代码的执行过程是先经过Parser进行语法解析



JS  代码 ☞ V8引擎中，Parse语法解析 ☞ Complier编译成可执行的，比如说JIT ☞运行☞GC GC的工作线程和js的执行线程是不一样的 GC的时候。js的执行线程就会暂停

wasm将解析和编译的一部分工作进行前置到开发阶段，js的是解析和编译是在运行时进行的，这也是拖慢了js执行的一个原因。然后js的GC会造成js的执行卡顿，而wasm是没有GC的，它是随时回收的，不会影响js的执行。





## 高性能计算

在网页开发阶段，JavaScript最初是单线程的设计，如果是多线程的话Dom的处理会很混乱，一段JavaScript是修改Dom样式，一段JavaScript是删除Dom，这就会很尴尬。所以JavaScript一直是以单线程为主，但是现在由于业务量以及出现一些复杂的计算会非常耗时，这就导致Dom的渲染会出现卡顿的问题，用户体验非常差。

```js
while(true){
  document.body.innerHTML += Math.random() + '<br>'
}
```



```js
Concurrent.Thread.js

Concurrent.Thread.create(function() {
  while(true){
    document.body.innerHTML += Math.random() + '<br>'
  }
});

https://www.cnblogs.com/woodk/articles/5199536.html
```



```js
const worker = new Worker('task.js')
worker.onmessage = event => document.body.innerHTML += event.data + '<br>'
   
# task.js
while(true){
  postMessage(Math.random())
}
```

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Atomics

```
Atomics
```

https://github.com/gpujs/gpu.js

```js
gpu.js
```





https://cloud.tencent.com/developer/article/1408474

https://wasdk.github.io/WasmFiddle/

https://developer.mozilla.org/zh-CN/docs/WebAssembly/Concepts

[官方中文网站](https://www.wasm.com.cn/)



https://ke.qq.com/webcourse/index.html#cid=1647350&term_id=102813387&taid=10959330611897078&type=1024&vid=5285890809759641120



https://ke.qq.com/webcourse/index.html#cid=413448&term_id=103178285&taid=10190368255921928&type=1024&vid=5285890811888457213



https://ke.qq.com/webcourse/369301/100439493#taid=3010613161075349&vid=5285890790550590766

