# nextTick

> 在下次DOM更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的DOM。

## 基本用法

> Vue.nextTick( [callback, context\] ) 

* `callback`：回调函数
* `context`: 回调函数的执行上下文

## 用途

#### created、mounted

在这两个生命周期钩子函数中如果需要操作渲染后的视图，需要使用nextTick方法。

> 注意 mounted 不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用 vm.$nextTick 替换掉 mounted

##### 获取`v-if`或`v-show`显示元素及其属性

```js
this.showMe = true;
this.$nextTick(()=>{
        //dom元素更新后执行，此时能拿到showMe控制显示的p元素的属性
        this.message = this.$refs.myWidth.offsetWidth;
  })
```

## 源码解读

> 源码路径：/src/core/utils/next-tick.js

下面为源码中的一些注释翻译：

> Here we have async deferring wrappers using microtasks. In 2.5 we used (macro) tasks (in combination with microtasks). However, it has subtle problems when state is changed right before repaint (e.g. #6813, out-in transitions). Also, using (macro) tasks in event handler would cause some weird behaviors that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109). So we now use microtasks everywhere, again. A major drawback of this tradeoff is that there are some scenarios where microtasks have too high a priority and fire in between supposedly sequential events  or even between bubbling of the same event.

 在这里我们用微任务来封装异步延迟，在2.5中，我们使用宏任务与微任务的结合。然而它还是有一些微妙的问题，比如当重绘前状态会被更改，例如在  out-in动画 转换中。此外  在事件处理程序中宏任务会有一些不可避免的奇怪的行为，所以，我们又在到处使用微任务。这种权衡方法在某些场景中会有一个主要的缺点： 在推测事件顺序或者同一事件的冒泡之间，微任务都有很高的优先级和火力。

>  The nextTick behavior leverages the microtask queue, which can be accessed via either native Promise.then or MutationObserver.  MutationObserver has wider support, however it is seriously bugged in UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It completely stops working after triggering a few times... so, if native Promise is available, we will use it. 

nextTick 通过利用被执行环境认可的Promise.then 或 MutationObserver 的微任务队列， MutationObserver有更好的支持，然后 在iOS >= 9.3.3的UIWebView环境中，触发touch事件时有一个严重的bug， 再触发几次之后，它就会停止工作了，所以，如果promise是可用的，我们就用它。

> In problematic UIWebViews, Promise.then doesn't completely break, but it can get stuck in a weird state where callbacks are pushed into the microtask queue but the queue isn't being flushed, until the browser needs to do some other work, e.g. handle a timer. Therefore we can "force" the microtask queue to be flushed by adding an empty timer.

在有问题的UIWebViews中，Promise.then也不能完全的解决问题，但是它会被卡在一个奇怪的状态中，当回调被push到微任务队列中，但是队列不会被刷新，直到浏览器需要去处理一些其他的工作，例如 处理计时器。因此我们需要往宏任务队列中添加一个空的计时器来强行触发清空执行回调任务。

```js
/* @flow */
/* globals MutationObserver */

import { noop } from 'shared/util'
import { handleError } from './error'
import { isIE, isIOS, isNative } from './env'

export let isUsingMicroTask = false

const callbacks = []
let pending = false

// 清空callbacks数组，用新数组接收所有回调函数并执行回调，清空回调函数数组
function flushCallbacks() {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

// 设置在下次事件循环触发callbacks的触发函数
let timerFunc  

/* istanbul ignore next, $flow-disable-line */

// nextTick的降级兼容策略 Promise --> MutationObserver --> setImmediate --> 宏任务 setTimeout 0
// 如果支持promise，使用promise实现
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)

    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // 如果Promise不支持，但支持MutationObserver
  // H5新特性，微任务,当dom变动是触发,注意是所有的dom都改变结束后触发
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // 如果Promise和MutationObserver都不支持，则使用setImmediate
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  // 最后的兼容方案，宏任务的settimeout 0
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

// nextTick主函数  参数1：回调函数 参数2：回调函数的执行上下文
export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    //如果有回调函数，执行回调函数 用try...catch...捕获错误 
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      //触发Promise的then回调
      _resolve(ctx)
    }
  })
  //是否执行刷新callback队列
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  //如果没有传递回调函数，并且当前浏览器支持promise，使用promise实现
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}

```

##### 从源码中可以看出，nextTick主要分为三部分：

1. 处理callbacks函数；
2. nextTick的降级兼容策略，Promise --> MutationObserver --> setImmediate --> 宏任务 setTimeout 0；
3. nextTick主函数。

##### 主要执行过程：

1. 利用闭包的原理保存了各个回调函数的引用，然后放入callbacks数组中；
2. 如果当前队列还未执行回调，那么开始执行回调，并标记当前任务队列已经执行过回调；
3. 最后判断当前浏览器具有Promise环境且为传递回调函数则采用Promise执行。

##### nextTick的降级兼容策略 

`Promise` --> `MutationObserver` --> `setImmediate` --> `宏任务 setTimeout 0`

##### MutationObserver 概述

* 监视 DOM 变动的接口当监视的 DOM 发生变动时 MutationObserver 将收到通知并触发事先设定好的回调函数。

* 类似于事件，但是异步触发。添加监视时，MutationObserver 上的 observer 函数与 addEventListener 有相似之处，但不同于后者的同步触发，MutationObserver是异步触发，此举是为了避免 DOM 频繁变动导致回调函数被频繁调用，造成浏览器卡顿。

##  原理

> Vue实现响应式并不是数据发生变化之后立刻更新DOM，而是等**同一事件循环**中的所有数据变化完成之后，再统一进行视图更新。也就是说**Vue是异步执行DOM更新**的。

所以如何在视图更新完毕后再获取DOM元素及属性呢？那就涉及到JavaScript的事件循环机制。

### [JS事件循环](https://www.yuque.com/guohh/yo6wpa/tmazrg)

##### 浏览器五大进程：

* GUI渲染进程
* JS引擎线程
* 事件触发线程
* 定时处理线程
* HTTP请求线程

##### 事件循环机制

事件循环机制和异步队列的维护是由事件触发线程控制的。它维护一个异步事件队列。JS引擎会维护一个同步执行栈，同步代码会依次加入执行栈中进行，执行结束后出站。如果遇到异步，就会交给对应的线程来完成异步任务，等异步任务执行完成，然后由事件触发线程将异步对应的回到函数加入到异步事件队列中。等同步执行栈中的任务执行完毕，事件触发线程就会从异步事件中取出最先加入的异步回调函数进行执行，提取规则遵循先入先出的规则，异步事件队列类似队列的数据结构。

##### 微任务宏任务

**macrotask：**

* setTimeout

- setInterval

- I/O（ajax）

- UI rendering

- setImmediate(nodejs)

**microtask：**

- Promise

- Object.observe(已经废弃)

- MutationObserver

- process.nextTick(nodejs)

**注：宏任务是js引擎进行处理的，微任务是浏览器的行为。微任务必然是由宏任务执行是创建的。**

##### 执行顺序

1. 执行一个宏任务（栈中没有就从事件队列中获取，可以理解为一个script标签）
2. 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
3. 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
4. 当前微任务执行完毕，开始检查渲染，然后GUI线程接管渲染
5. 渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取）