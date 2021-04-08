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

我们先看V8引擎中JS代码的执行过程：浏览器拿到源代码后，经过`Parse`解析器生成`AST`，再交由`Ignition`解释器，生成字节码，如果同一段代码执行很多次，就会被标记为HotSpot热点代码，就会把这段代码交给TurboFan编译器将这段代码编译成更高效的机器码并存储起来，方便下次执行这段代码时，就会直接用机器码代替字节码进行执行，提高代码的执行效率。

解释器生成AST、编译器生成字节码、机器码，进行优化，然后执行后进行GC垃圾回收。  

wasm将解析和编译的一部分工作进行前置到开发阶段，js的是解析和编译是在运行时进行的，这也是拖慢了js执行的一个原因。然后js的GC会造成js的执行卡顿，而wasm在浏览器中执行时是没有GC阶段的，它的内部代码是支持手动操作内存的语言，所以可以在它的模块中内置垃圾回收器。

## [JavaScript API](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly)

### 方法

##### `WebAssembly.complier()`

```js
Promise<WebAssembly.Module> WebAssembly.complie(bufferSource)
```

通过上面的方法原型可以看出来，`complier()`方法返回的是一个`Promise`对象，所以我们能通过`then`方法获取到`wasm`内容，不过此时拿到的数据是模块的二进制的`buffer`，下面就需要类方法`Module`创建这个对象

##### `WebAssembly.validate()`

```js
WebAssembly.validate(bufferSource)
```

这个方法是用来校验拿到的对象时否正确，它返回的是结果是`true/false`

##### `WebAssembly.instantiate()`

允许你编译和实例化 WebAssembly 代码。这个方法有两个重载方式:

- 第一种主要重载方式使用WebAssembly二进制代码的 [typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) 或[`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)形，一并进行编译和实例化。返回的 `Promise` 会携带已编译的 [`WebAssembly.Module`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module) 和它的第一个实例化对象 [`WebAssembly.Instance`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance).
- 第二种重载使用已编译的 [`WebAssembly.Module`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module) , 返回的 `Promise` 携带一个 `Module`的实例化对象 `Instance`. 如果这个 `Module` 已经被编译了或者是从缓存中获取的( [retrieved from cache](https://developer.mozilla.org/en-US/docs/WebAssembly/Caching_modules)), 那么这种重载方式是非常有用的.

### 类

##### `WebAssembly.Module` 

包含已经由浏览器编译的无装啊提WebAssembly代码，可以高效地与Workers共享、缓存在IndexDB中，和多次实例化。

`WebAssembly.Module()` 构造函数可以用来同步编译给定的 WebAssembly 二进制代码。不过，获取 `Module` 对象的主要方法是通过异步编译函数，如 `WebAssembly.compile()`，或者是通过 IndexedDB 读取 Module 对象。

##### `WebAssembly.Instance`

 `WebAssembly.Instance`对象本身是有状态的，是 `WebAssembly.Module` 的一个可执行实例。 实例包含所有的 WebAssembly 导出函数 ，允许从JavaScript 调用 WebAssembly 代码。

`WebAssembly.Instance()` 构造函数以同步方式实例化一个`WebAssembly.Module` 对象。 然而, 通常获取实例的方法是通过异步函数`WebAssembly.instantiate()`。

##### **`WebAssembly.Memory`**

该对象的 `buffer` 属性是一个可调整大小的 [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) ，其内存储的是 `WebAssembly `实例所访问内存的原始字节码。

可用于JavaScript和WebAssembly的数据共享。JavaScript代码是在V8内进行管理执行的，而wasm不在v8内的，虽然wasm模块是由v8进行实例化的，但是它只是对wasm的整体进行实例化的，无法探查到wasm内部的执行情况，而且wasm是一般都是由后端语言进行编写的，他们也都是有自己的内存管理。  v8的内存是由它的上层浏览器或者Node给提供的，v8即不知道wasm模块是由什么语言写的、也不知道它的内存情况。

V8这个范畴和wasm创建的实例里边这相当于两个进程，它们两个的数据交换可以通过函数调用返回一个返回值，但是当想要交换一个对象时就会出现问题，因为他们的对象格式是不一样的，wasm模块内的后端语言可能是一些结构体，这样就会存在问题。 那么它们之间需要有一个共同的内存空间，具体的数据格式由开发者自己来规定。

##### `WebAssembly.Table`

构造函数根据给定的大小和元素类型创建一个Table对象。 

这是一个包装了WebAssemble Table 的Javascript包装对象，具有类数组结构，存储了多个函数引用。在Javascript或者WebAssemble中创建Table 对象可以同时被Javascript或WebAssemble 访问和更改。

##### `WebAssembly.CompikeError`

构造函数创建一个新的WebAssembly `CompileError`对象，该对象表示WebAssembly解码或验证期间的错误。

##### `WebAssembly.LinkError`

##### `WebAssembly.RuntimeError`

构造函数创建一个新的WebAssembly RuntimeError对象---一个每当WebAssembly陷入指定陷阱时将抛出的类型。

## WebAssembly的工具

#### AssemblyScript

支持直接将Typescript编译成WebAssembly。这对于前端来说入门的门槛很低。

#### Emscripten

可以说是WebAssembly的灵魂工具。将其他的高级语言，编译成WebAssembly。

#### WABT

将WebAssembly在字节码和文本格式相互转换的一个工具，方便开发者去理解这个wasm到底在做什么事。不过反编译出来的代码不太理想。

## 使用C语言编写wasm

### 两种方式

1. [Emscripten](https://emscripten.org/docs/getting_started/downloads.html) ，相对比较复杂，需要配置
2. [WasmFiddle](https://wasdk.github.io/WasmFiddle/)，在线版

#### Emscripten

1. 首先在克隆官方项目，也可以直接下载项目到本地，进入项目

   ```shell
   # Get the emsdk repo
   git clone https://github.com/emscripten-core/emsdk.git
   
   # Enter that directory
   cd emsdk
   ```

2. 运行以下emsdk命令，从GitHub获取最新的工具，并将它们设置为Active（注意前面要加上当前目录）

   ```shell
   # Download and install the latest SDK tools.
   ./emsdk install latest
   
   # Make the "latest" SDK "active" for the current user. (writes .emscripten file)
   ./emsdk activate latest
   
   # Activate PATH and other environment variables in the current terminal
   source ./emsdk_env.sh
   ```

   这一步结束后可以通过命令行输入： `emcc`，当出现如下提示时说明已安装成功， 提示没有文件执行。

   ```shell
   shared:INFO: (Emscripten: Running sanity checks)
   emcc: error: no input files
   ```

   **注意：想要执行emcc，前提是要有gcc。**

3. 创建C执行文件 

   ```c
   #include <stdio.h> // 引入标准输入输出库
   
   // 声明加法函数
   int add(int, int);
   
   // 主函数
   int main(int argc, char const *argv[]) {
   
       printf("hello WebAssembly!\n");
       printf("%d\n", add(10, 20));
       return 0;
   }
   
   // 加法函数
   int add( int x, int y) {
       return x + y;
   }
   ```

   然后通过gcc命令将该文件编译成可执行的C语言文件hello，验证C语言文件的正确性。

   ```shell
   gcc demo.c -o hello
   ./hello
   ```

4. 通过emcc命令生成在node环境执行的文件

   ```shell
   emcc demo.c -o demo_node.js
   node demo_node.js
   ```

   这个命令会生成两个文件，一个是js文件，一个是wasm文件。node中不能直接执行wasm文件，需要刚刚生成的js文件作为桥接来执行。

5. 通过emcc命令生成在浏览器环境执行的文件

   ```shell
   # -s 为优化选项  WASM=1要定制为WASM文件 -O1-4 优化等级  1<4 去掉一些无用的代码 O3要慎用
   emcc demo.c -s WASM=1 -O3 -o  demo_html.html
   ```

   该命令会生成三个文件，html、js和wasm。注意这里需要注意同源策略问题，可以用http-server或live-server来启动。

## 高性能计算

在网页开发阶段，JavaScript最初是单线程的设计，如果是多线程的话Dom的处理会很混乱，一段JavaScript是修改Dom样式，一段JavaScript是删除Dom，这就会很尴尬。所以JavaScript一直是以单线程为主，但是现在由于业务量以及出现一些复杂的计算会非常耗时，这就导致Dom的渲染会出现卡顿的问题，用户体验非常差。

```js
while(true){
  document.body.innerHTML += Math.random() + '<br>'
}
```

#### Concurrent.Thread.js

```js
Concurrent.Thread.create(function() {
  while(true){
    document.body.innerHTML += Math.random() + '<br>'
  }
});

// https://www.cnblogs.com/woodk/articles/5199536.html
```

#### Worker

```js
const worker = new Worker('task.js')
worker.onmessage = event => document.body.innerHTML += event.data + '<br>'
   
# task.js
while(true){
  postMessage(Math.random())
}
```

#### [Atomics](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Atomics)

```html
<script>
    const worker = new Worker('task2.js');
    const sharedArrayBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 1000000);
    const sharedArray = new Int32Array(sharedArrayBuffer);
    for (let i = 0; i < 10; i++) {
    	Atomics.store(sharedArray, i, i + 1);
    }
    worker.postMessage(sharedArray);
    const itemValue = Atomics.load(sharedArray, 2);
    const result = 'joker' + itemValue;
    Atomics.store(sharedArray, result);
    const queuePos = 1;
    Atomics.notify(sharedArray, 2, queuePos);
</script>

<!-- task2.js -->
self.addEventListener("message", e => {
     const shareArray = e.data;
     Atomics.wait(shareArray, 2, "joker");
     console.log('🍉');
})
```

#### [gpu.js](https://github.com/gpujs/gpu.js)

```js
// GPU is a constructor and namespace for browser
const gpu = new GPU();
const multiplyMatrix = gpu
    .createKernel(function (a, b) {
        let sum = 0;
        for (let i = 0; i < 512; i++) {
            sum += a[this.thread.y][i] * b[i][this.thread.x];
        }
        return sum;
    })
    .setOutput([512, 512]);
const a = b = [3,4,5,6,7,8]
const c = multiplyMatrix(a, b);
console.log(c);
```

具体使用方式可查看[github](https://github.com/gpujs/gpu.js)。

#### webAssembly

编写一个包含add 和square的c语言函数，通过之前的方式编译成wasm文件，也可以使用在线版进行编译。

```c
int add (int x, int y) {
    return x + y;
}

int square(int num ) {
    return num * num;
}
```

使用JavaScriptAPI进行加载C语言方式

```js
// 第一种加载方式 
function loadWebAssembly(path, imports={}) {
    return fetch(path)
      .then(res=>res.arrayBuffer())
      .then(buffer => WebAssembly.compile(buffer))
      .then(module=>{
      // 创建WebAssembly实例 imports 开辟空间 创建变量映射等
      return new WebAssembly.Instance(module, imports)
    })
}
// 这是第二种加载方式
function loadWebAssembly2(path, imports={}) {
  return fetch(path)
    .then(res=>res.arrayBuffer())
    .then(WebAssembly.instantiate)
    .then(module=>module.instance)
}

loadWebAssembly('./math.wasm').then(instance => {
  console.log(instance);
  const add = instance.exports.add
  const squ = instance.exports.square
  console.log(add(3,31));
  console.log(squ(3));
})
```

## 其他使用场景

2. 游戏业务场景
3. 3D渲染场景
4. 业务里复杂的技术

## 总结

WebAssembly 标准虽然已经定稿并且得到主流浏览器的实现，但目前还存在以下问题：

- 浏览器兼容性不好，只有最新版本的浏览器支持，并且不同的浏览器对 JS WebAssembly 互调的 API 支持不一致；
- 生态工具不完善不成熟，目前还不能找到一门体验流畅的编写 WebAssembly 的语言，都还处于起步阶段；
- 学习资料太少，很多使用过程的坑还需要去踩。

总之现在的 WebAssembly 还不算成熟，如果你的团队没有不可容忍的性能问题，那现在使用 WebAssembly 到产品中还不是时候， 因为这可能会影响到团队的开发效率，或者遇到无法轻易解决的坑而阻塞开发。

### 参考文档

1. [官方中文网站](https://www.wasm.com.cn/)
2. [MDN WebAssembly](https://developer.mozilla.org/zh-CN/docs/WebAssembly/Concepts)
3. [腾讯云WebAssembly中文文档](https://cloud.tencent.com/developer/chapter/13629)
4. [在线编译WebAssembly文件](https://wasdk.github.io/WasmFiddle/)

 