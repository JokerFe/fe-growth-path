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

// Here we have async deferring wrappers using microtasks.
// 在这里我们用微任务来封装异步延迟
// In 2.5 we used (macro) tasks (in combination with microtasks).
// 在2.5中，我们使用宏任务与微任务的结合。
// However, it has subtle problems when state is changed right before repaint
// 然而它还是有一些微妙的问题，比如当重绘前状态会被更改
// (e.g. #6813, out-in transitions).
// 例如在  out-in动画 转换中
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// 此外  在事件处理程序中宏任务会有一些不可避免的奇怪的行为
// So we now use microtasks everywhere, again.
// 所以，我们又在到处使用微任务
// A major drawback of this tradeoff is that there are some scenarios  
// where microtasks have too high a priority and fire in between supposedly sequential events   
// or even between bubbling of the same event
// 这种权衡方法在某些场景中会有一个主要的缺点： 在推测事件顺序或者同一事件的冒泡之间，微任务都有很高的优先级和火力

let timerFunc  // 设置在下次事件循环触发callbacks的触发函数

// The nextTick behavior leverages the microtask queue, which can be accessed via either native Promise.then or MutationObserver. 
// nextTick 通过利用被执行环境认可的Promise.then 或 MutationObserver 的微任务队列，
// MutationObserver has wider support, however it is seriously bugged in UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. 
// MutationObserver有更好的支持，然后 在iOS >= 9.3.3的UIWebView环境中，触发touch事件时有一个严重的bug
// It completely stops working after triggering a few times... so, if native Promise is available, we will use it:
// 再触发几次之后，它就会停止工作了，所以，如果promise是可用的，我们就用它。

// In problematic UIWebViews, Promise.then doesn't completely break, 
// 在有问题的UIWebViews中，Promise.then也不能完全的解决问题
// but it can get stuck in a weird state where callbacks are pushed into the microtask queue but the queue isn't being flushed, until the browser needs to do some other work, e.g. handle a timer. 
// 但是它会被卡在一个奇怪的状态中，当回调被push到微任务队列中，但是队列不会被刷新，直到浏览器需要去处理一些其他的工作，例如 处理计时器
// Therefore we can "force" the microtask queue to be flushed by adding an empty timer.
// 因此我们需要往宏任务队列中添加一个空的计时器来强行清空执行回调任务

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
