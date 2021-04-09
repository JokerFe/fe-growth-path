## 前言

我们都知道JavaScript是单线程，不管是执行在浏览器中的还是执行在node环境中的。为什么js要设计成单线程的呢？主要是因为JavaScript主要是应用于用户端的，如果是多线程的话，一个线程删除dom，另一个线程修改dom的样式，这样的就会造成页面错误，为了避免这种情况，JavaScript在诞生之初，避免这样的复杂性，就采用了单线程。

虽然说JavaScript是单线程的，并不意味着JavaScript只能做一件事情，否则一个网络请求或者耗时的操作就会造成页面的卡死现象。为了解决这种问题，浏览器和Node中就实现了一个EventLoop的东西。

## 浏览器的EventLoop

### 浏览器线程

我们都知道Javascript是单线程的，但是浏览器不是。这里的单线程是指：浏览器中用来解释执行JavaScript代码的只有一个线程，也就是JS引擎线程。那么浏览器有哪些线程呢？

1. **GUI渲染线程**：负责浏览器的界面渲染，包括解析HTML、CSS，构建DOM树、Render树、布局和绘制等工作。当页面发生重绘、重排(回流)时，也是该线程执行。
2. **JS引擎线程**：负责处理、解析和执行JavaScript脚本程序，如V8引擎。该线程与GUI渲染线程是互斥的，优先级高于GUI渲染线程。JS执行时间过长，就会造成页面渲染的不流畅、导致页面渲染加载阻塞。
3. **事件触发线程**：用来控制事件循环的调度器，当有异步任务时：setTimeout、点击事件、Ajax请求等，它会将这些任务交给对应的线程去处理，处理完成后再由它将事件添加到任务队列的队尾，等待JS引擎的处理。
4. **异步HTTP请求线程**：在XMLHttpRequest在连接后通过浏览器新开一个线程请求
5. **定时处理线程**：setInterval与setTimeout所在的线程。定时计数器是在该线程进行计时并触发。

### JavaScript的执行堆栈

JavaScript在执行可执行脚本的时候，首先会创建一个全局的可执行上下文globalContext，每执行一个函数的时候也会创建一个可执行上下文（executionContext EC）。为了管理这些执行上下文，js引擎创建了**执行上下文栈**（Execution Context Stack）ECS来管理这些执行上下文。当函数调用完成后，就会把当前函数的执行上下文销毁，回到上一个执行上下文... 这个过程会反复执行，直到执行中的代码执行完毕。需要注意的是，在ECS中永远会有globalContext垫底，永远存在于栈底。

### EventLoop

浏览器通过**事件触发线程**来控制**事件循环机制**和**异步事件队列**(即消息队列)。JS引擎执行JavaScript代码时，遇到异步任务就会通过事件触发线程交给相应的线程单独去执行该任务，执行完成后由事件触发线程将异步任务对应的回调函数加入到异步事件队列中。

JS引擎会维护一个同步执行栈，同步代码会依次加入执行栈进行执行，执行结束后出栈。这一块涉及到**JavaScript的执行堆栈**的内容。如果执行栈中的任务执行完成，即同步执行栈空闲，事件触发线程就会从异步事件队列中取出最先加入的异步回调函数进行执行，提取规则是**先入先出FIFO**规则，异步实践队列类似队列的数据结构。

#### 微任务宏任务

所有任务又分为微任务micro和宏任务macro。

**宏任务**包含：主代码块、setTimeout、setInterval、ajax、UI Render

**微任务**包含：Promise、Object.observe、MutationObserver

**宏任务是js引擎进行处理的，微任务是浏览器的行为。微任务必然是由宏任务执行是创建的。**

## Nodejs的EventLoop

首先我们需要知道Nodejs的事件循环是借助Libuv来实现。我们先看一下Nodejs程序的执行工作流。

![libuv](/Users/guohaohao3/Documents/Joker/Git/fe-growth-path/imgs/Node/libuv.png)

首先将JavaScript程序交给V8引擎进行解释、编译、优化最后通过Node的API去执行，然后来操作Libuv。Libuv其实就是基于一个大的轮询事件池EventLoop来实现的。首先将左侧的事件队列一次的加入到这个轮询池中，然后通过事件操作符交给工作线程来执行，执行完成后通过执行回调函数依次会退给应用程序。

那么EventLoop内的具体操作又是怎样执行的呢？

![eventloop](/Users/guohaohao3/Documents/Joker/Git/fe-growth-path/imgs/Node/eventloop.png)

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

#### 微任务宏任务

**宏任务**包含：setTimeout、setInterval、I/O、setImmediate

**微任务**包含：Promise、process.nextTick

### Node不同版本下的EventLoop

##### v11之前

一旦执行一个阶段，会先将这个阶段里的所有任务执行完成之后才会执行该阶段剩下的微任务。

##### v11之后

一旦执行一个阶段里的宏任务，就立刻执行对应的微任务队列。