[toc]

## koa2洋葱模型

```js
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

## eventLoop

🍊 前言

我们都知道JavaScript是单线程，不管是执行在浏览器中的还是执行在node环境中的。为什么js要设计成单线程的呢？主要是因为JavaScript主要是应用于用户端的，如果是多线程的话，一个线程删除dom，另一个线程修改dom的样式，这样的就会造成页面错误，为了避免这种情况，JavaScript在诞生之初，避免这样的复杂性，就采用了单线程。

虽然说JavaScript是单线程的，并不意味着JavaScript只能做一件事情，否则一个网络请求或者耗时的操作就会造成页面的卡死现象。为了解决这种问题，浏览器和Node中就实现了一个EventLoop的东西。

🍊 浏览器的EventLoop

浏览器线程

Javascript是单线程的，但是浏览器不是。不过浏览器中用来解释执行JavaScript代码的只有一个线程，也就是JS引擎线程。那么浏览器有哪些线程呢？

1. **GUI渲染线程**：负责浏览器的界面渲染，包括解析HTML、CSS，构建DOM树、Render树、布局和绘制等工作。当页面发生重绘、重排(回流)时，也是该线程执行。
2. **JS引擎线程**：负责处理、解析和执行JavaScript脚本程序，如V8引擎。该线程与GUI渲染线程是互斥的，优先级高于GUI渲染线程。JS执行时间过长，就会造成页面渲染的不流畅、导致页面渲染加载阻塞。
3. **事件触发线程**：用来控制事件循环的调度器，当有异步任务时：setTimeout、点击事件、Ajax请求等，它会将这些任务交给对应的线程去处理，处理完成后再由它将事件添加到任务队列的队尾，等待JS引擎的处理。
4. **异步HTTP请求线程**：在XMLHttpRequest在连接后通过浏览器新开一个线程请求
5. **定时处理线程**：setInterval与setTimeout所在的线程。定时计数器是在该线程进行计时并触发。

JavaScript的执行堆栈

JavaScript在执行可执行脚本的时候，首先会创建一个全局的可执行上下文globalContext，每执行一个函数的时候也会创建一个可执行上下文（executionContext EC）。为了管理这些执行上下文，js引擎创建了**执行上下文栈**（Execution Context Stack）ECS来管理这些执行上下文。当函数调用完成后，就会把当前函数的执行上下文销毁，回到上一个执行上下文... 这个过程会反复执行，直到执行中的代码执行完毕。需要注意的是，在ECS中永远会有globalContext垫底，永远存在于栈底。

EventLoop

浏览器通过**事件触发线程**来控制**事件循环机制**和**异步事件队列**(即消息队列)。JS引擎执行JavaScript代码时，遇到异步任务就会通过事件触发线程交给相应的线程单独去执行该任务，执行完成后由事件触发线程将异步任务对应的回调函数加入到异步事件队列中。

JS引擎会维护一个同步执行栈，同步代码会依次加入执行栈进行执行，执行结束后出栈。这一块涉及到**JavaScript的执行堆栈**的内容。如果执行栈中的任务执行完成，即同步执行栈空闲，事件触发线程就会从异步事件队列中取出最先加入的异步回调函数进行执行，提取规则是**先入先出FIFO**规则，异步实践队列类似队列的数据结构。

微任务宏任务

所有任务又分为微任务micro和宏任务macro。

**宏任务**包含：主代码块、setTimeout、setInterval、ajax、UI Render

**微任务**包含：Promise、Object.observe、MutationObserver

**宏任务是js引擎进行处理的，微任务是浏览器的行为。微任务必然是由宏任务执行是创建的。**

🍊 Nodejs的EventLoop

首先我们需要知道Nodejs的事件循环是借助Libuv来实现。我们先看一下Nodejs程序的执行工作流。

首先将JavaScript程序交给V8引擎进行解释、编译、优化最后通过Node的API去执行，然后来操作Libuv。Libuv其实就是基于一个大的轮询事件池EventLoop来实现的。首先将左侧的事件队列一次的加入到这个轮询池中，然后通过事件操作符交给工作线程来执行，执行完成后通过执行回调函数依次会退给应用程序。

那么EventLoop内的具体操作又是怎样执行的呢？

EventLoop共分为6个阶段，分别是：

1. timers：定时器阶段，在这个阶段执行setTimeout或者setInterval之类的定时器；
2. pending callbacks ：主要是一些异步IO的回调、网络的回调、TCP的回调可能在这个阶段执行；
3. idel，prepare：它主要是内部动作的一些钩子函数的执行阶段
4. poll： 它主要是来监听轮询池中是否有新的任务进入还是有任务执行完成，它是真正工作的阶段。比如incoming、connections、data、etc等；
5. check：执行setImmediate的阶段
6. close callback 

这6步是一个无限循环的过程，其中比较重要的是`timers`、`poll`和`check`阶段。每个阶段执行完成，进入下一个阶段的之前，都会执行nextTick函数。**需要注意的是：我们可以理解为`poll`阶段为EventLoop的入口和控制阶段。**

如果poll内不是空的，那么就会在系统的控制下执行完它的内容。当poll为空是就会检测是否有setImmediate，如果有立即进入check阶段执行setImmediate；如果没有，就去判断是否有过期的定时任务，如果有就交给timers执行。poll阶段是控制定时任务什么时候执行的，具体的执行还是timers阶段。当所有任务执行完成后就会阻塞或者说是停到poll阶段，通过观察者来监听是否有新的任务进入或者执行完毕，关闭回调。

那么这个观察者又分为三大类，主要负责将事件分类，分别是：

1. idle观察者：`process.nextTick()`，效率最高、消耗资源小、但会阻塞CPU的后续调用；
2. IO观察者：类似 `setTimeout()`，精准度不高，可能有延迟执行的情况，且引用动用了红黑树，所以消耗资源大；
3. check观察者：类似`setImmediate`，消耗的资源小，也不会造成阻塞，但是效率最低。

不同的观察者它很清楚执行阶段还有多少个任务需要执行。它们的执行优先级如下：

```js
idle观察者 > Promise.then > io观察者 > check观察者
```

微任务宏任务

**宏任务**包含：setTimeout、setInterval、I/O、setImmediate

**微任务**包含：Promise、process.nextTick

🍊 Node不同版本下的EventLoop

v11之前

一旦执行一个阶段，会先将这个阶段里的所有任务执行完成之后才会执行该阶段剩下的微任务。

v11之后

一旦执行一个阶段里的宏任务，就立刻执行对应的微任务队列。

## Node文件查找优先级

1. 从文件模块缓存中加载
   * 尽管原生模块与文件模块的优先级不同，但是都不会优先于文件模块的缓存中加载已经存在的模块
2. 从原生模块加载
   * 原生模块的优先级仅次于文件模块缓存的优先级。require方法在解析文件名之后，优先检查模块是否在原生模块列表中。以hhttp模块为例，尽管目录下存在一个此文件，`require('http/json')`都不会从这些文件中加载，而是从原生模块中加载。同时原生模块也有一个缓存区，同样也是优先从缓存区加载过，则调用原生模块的加载方式进行加载和执行。
3. 从文件加载
   * 当文件模块缓存中不存在，而且不是原生模块的时候，node会解析require方法传入的参数，并从文件系统中加载实际的文件。

## Require方法中文件查找策略

由于Node中存在4类模块（原生模块和3种文件模块），尽管require方法使用起来极其简单，但是它内部的加载确实十分复杂的，其加载优先级也各自不同，简而言之，如果require绝对路径的文件，查找时不会去遍历每一个node_modules目录，其速度最快。

1. 从module path数组中取值第一个目录作为查找基准
2. 继续从目录中查找该文件，如果存在，则结束查找。如果不存在进行下一条查找。
3. 尝试添加`.js`、`.json`、`.node`后缀进行查找，如果文件存在，则结束查找
4. 尝试将require的参数作为一个包来查找，读取目录下的package.json文件，取得main参数指定的文件
5. 尝试查找该文件，如果存在，则结束。如果不存在则重复3
6. 如果继续失败，则取出module path数组中的下一个目录作为基准查找，循环1-5步
7. 如果继续失败，则循环1-6步骤，知道module path中的最后一个值。
8. 如果仍然失败，则抛出异常

总结

整个查找过程十分类似原型链的查找和作用域的朝招。所幸Node对路径查找实现了缓存机制，否则由于每次判断路径都是同步阻塞式进行，会导致严重的性能消耗。

## express和koa的区别

1. **异步事件处理**： express 是通过
2. 来实现的，koa1 是采用generator，koa2是采用async/await。js处理异步： callback ☞ promise  ☞ generator ☞ async/await。
3. **错误处理**：express是通过callback处理的，无法捕获深层次的错误。koa采用的try/catch捕获的，能更好的获取异常。
4. **总结**：koa相比与express的好处是：异步处理流程优化和错误捕获，并且拆出了express的router和view功能，使得框架更轻，缺点在于社区相对较小。

## koa原理

- **application**：入口文件，主要有两个函数`app.listen()`、`app.use()`。一个用来监听端口，一个用来使用中间件
- **context**：代理文件，用来代理request和response
- **request**：请求相关的操作
- **response**：相应相关的操作
- **koa-compose**：处理中间件的核心代码。

🍊 中间件处理

app.use() 将中间件push到中间件数组中，然后在listen方法中通过调用compose方法进行集中处理。koa的中间件处理可以当做是洋葱模型。中间件数组中中间件的执行是通过递归的方式来执行，调用dispatch函数，从第一个开始执行，当有next方法时创建一个promise，等到下一个中间件执行结果后再执行next后端代码。当第二个中间件也有next方法时，依然会创建一个新的promise等待下一个中间件的执行结果，这也就是中间件next的执行原理，核心代码是`return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));`，递归遍历，直到遍历完所有的中间件next，生成一个多层嵌套的promise函数。

```
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */
  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

## V8垃圾回收机制

v8的GC分为新生代和老生代：新生代存放存活时间短的变量，区域小回收频繁；老生代存放存活时间长的变量。

新生代回收机制是**scavenge**算法。将空间分为from和to两块，新创建的变量会手机线进入from，当from满时就会触发GC，将非存活变量释放掉，存活的变量放到to中，然后将to和from位置互换。反复执行，当空间to的内存达到25%时就会触发晋升，将存活的变量晋升到老生代中。 scavege算法存在一个问题，堆内存只能使用一半，空间交换时间。

老生代使用的是**Mark-Sweep**和**Mark-compact**。使用Mark-Sweep将非存活的对象进行标记，然后清除，这样就会出现不连续的内存空间，所以我们就需要使用到Mark-Compact，他是基于Mark-Sweep 实现的，他会将存活的对象移到另一块连续的堆内存空间内，然后将其余的空间进行清除。

新生代是广度优先遍历，老生代是深度优先遍历。

在scavenge算法中会使用到**扫描指针**和**存储指针**，用来进行from->to的实现。存储指针指向的是需要存储对象的位置，扫描指针用来从头开始扫描对象，扫描的对象有指向，就像指向的对象存储到存储指针的位置，然后存储指针后移，将扫描到对象所指向的对象都存储完毕后，扫描指针后移，知道扫描指针和存储指针重合，说明从from到to的过程结束。

## Node的事件循环

Node的事件循环是借助libuv来实现的，libuv是一个高性能事件驱动的程序，他本质就是一个大的while循环。nodejs有一个事件队列，然后交给libuv，也就是event loop中进行轮询，当有事件操作符时，就交给工作线程来进行处理，处理完毕后再交给event loop然后返回给事件队列，表示该事件处理完毕。