# $watch

> 观察Vue实例上的一个表达式或者一个函数计算结果的变化。回调函数得到的函数为新值和旧值。表达式值接受监督的键路径。对于更复杂的表达式，用一个函数替代。

## 基本用法

> vm.$watch( expOrFn, callback, [options\] )

**参数**：

- `{string | Function} expOrFn`   键路径
- `{Function | Object} callback` 回调函数
- `{Object} [options]` 可配置参数
  - `{boolean} deep` 设为true时可发现对象内部值的变化，该配置是给Watcher使用
  - `{boolean} immediate` 设为true时将立即以表达式的当前值触发回调

**返回值**：`{Function} unwatch` 返回值为一个取消观察函数，调用该函数可用来停止触发回调。

```js
var unwatch = vm.$watch(
  'value',
  function () {
    doSomething()
    if (unwatch) {
      unwatch()
    }
  },
  {
    deep:true, 
   	immediate: true 
  }
)
```

## 源码解读

> 源码路径： /src/core/instance/state.js  stateMixin函数内

```js

// 创建观察者
function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  // 调用vm原型方法返回一个观察者对象
  return vm.$watch(expOrFn, handler, options)
}  

  // 往vue原型上挂载，可接受三个参数，键路径、回调函数、配置参数；返回一个销毁函数
  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    // 如果是对象 通过递归的方式创建观察者
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    // 创建watcher对象
    const watcher = new Watcher(vm, expOrFn, cb, options)
    // 如果immediate 为true 立即执行回调函数
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value)
      } catch (error) {
        handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
      }
    }
    // 返回一个函数，调用watcher的删除方法
    return function unwatchFn () {
      watcher.teardown()
    }
  }
```

`$watch`是`Vue.prototype`上的方法，主要的实现原理依托于`Watcher`观察者，详细实现方式参考Vue双向数据绑定中的`Watcher`实现原理。

