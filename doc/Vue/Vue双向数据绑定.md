# Vue双向数据绑定

> Vue的双向数据绑定是采用数据劫持结合发布者订阅者的方式，通过`Object.definProperty()`来劫持各个属性的`set`和`get`方法，在数据变动时发送消息给订阅者，触发相应的监听事件。

## MVC与MVVM

> MVC和MVVM都是用来解决界面呈现和逻辑代码分离而出现的模式，用来解决视图层和业务逻辑层的耦合。

#### MVC

全名`Model View Controller`，是模型 -- 视图 -- 控制器的缩写。目的是实现`M`和`V` 的代码分离。

* **Model**：用于封装与应用程序的业务逻辑相关的数据以及对数据的处理方法。

* **View:** 视图层负责数据的展示。
* **Controller:** M和V之间的连接器，用于控制应用程序的流程。

 优点： 

* 耦合性低
* 开发速度快
* 可维护性高

#####  MVVM

`Model-View-ViewModel`的简写。`ViewModel实现了视图层和数据层的同步逻辑自动化了。

* **Model：**数据层，它仅仅关注数据本身，不关心任何行为，可以理解为一个数据对象。
* **View：** 视图层，通过使用模板语法来声明式的将数据渲染进DOM。
* **ViewModel：**业务逻辑，Model和View之间的桥梁，实现Model层数据变化，View层更新DOM。

MVVM与MVC最大的区别就是：它实现了**View和Model的自动同步**，也就是当Model的属性改变时，我们不用再自己手动操作Dom元素，来改变View的显示，而是改变属性后该属性对应View层显示会自动改变。

## `Object.defineProperty()`

`**Object.defineProperty()**` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

```js
Object.defineProperty(obj, prop, descriptor)
```

* `obj`：要定义属性的对象。
* `prop`： 要定义或修改的属性的名称或Symbol。
* `descriptor`： 要定义或修改的属性描述符。
  * `configurable`：当且仅当该属性的 `configurable` 键值为 `true` 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。
    **默认为** **`false`**。
  * `enumerable`：当且仅当该属性的 `enumerable` 键值为 `true` 时，该属性才会出现在对象的枚举属性中。
    **默认为 `false`**。
  * `value`： 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。
    **默认为 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)**。
  * `writable`: 当且仅当该属性的 `writable` 键值为 `true` 时，属性的值，也就是上面的 `value`，才能被[`赋值运算符`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Assignment_Operators)改变。
    **默认为 `false`。**
  * `get`: 属性的 getter 函数，如果没有 getter，则为 `undefined`。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 `this` 对象（由于继承关系，这里的`this`并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。
    **默认为 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)**。
  * `set`: 属性的 setter 函数，如果没有 setter，则为 `undefined`。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 `this` 对象。
    **默认为 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)**。

##### 缺点：

1. 它只能监听对象上的某个属性，所以在对象监听上需要遍历对象属性。
2. 它是直接修改属性。
3. 对数组的兼容性不够友好。
4. 不兼容到IE8。

## Vue实现双向数据绑定的流程

Vue是采用数据劫持结合发布者-订阅者模式的方法，通过`Object.defineProperty()`来劫持各个属性的`set`、`get`，在数据变动时发布消息给订阅之，触发相应的监听事件。主要有`watcher`、`dep`、`observer`和`complier`四块。

**第一步**：需要`observe`的数据对象进行递归遍历，包括子属性对象的属性，都加上`set`和`get`，就能进行数据变化的监听。

**第二步**：`compile`解析模板指令，将模板中的变量替换数据，然后初始化渲染页面视图，并将每个执行对象的节点绑定更新函数，添加监听数据的订阅者，一旦数据变化没收到通知就更新视图。

**第三步**：`watcher`订阅者是`Observe`和`compile`之间的栋梁；①在自身实例化时往属性订阅器dep里添加自己②自身必须有一个`update`方法③带属性变动`dep.notice()`通知时，能调用自身的`update`方法，并触发`compile`中绑定的回调。

**第四步**：MVVM作为数据绑定的入口，整合`observe`和`compile`和`watcher`三者，通过`observe`来监听自己的数据变化，通过`compile`来解析模板执行，最终利用`watcher`搭起`observe`和`compile`之间的通信，达到数据变化就更新视图，视图交互就更新数据的效果。

**注意**：`Object.defineProperty()`只能更新`data`已有数据的`set`和`get`，如果给data挂载新的属性时，需手动添加到`dep`和数据监听，即调用`vm.$set()`方法。

## 源码分析

### 入口

在[Virtual DOM](https://github.com/Jokul518/fe-growth-path/blob/master/doc/Vue/Virtual-DOM.md)篇中创建vNode流程中，在`src/core/instance/init.js`的`initMixin()`方法中调用`initState(vm)`方法，即`src/core/instance/state.js`中的`initState`方法，进行初始化vm实例上`data`、`props`、`method`、`watch`等属性。其中对`data`的初始化时，调用`initData`方法，最重要的一步为： `observe(data, true /* asRootData */)`来进行数据的监听。此为进入Vue双向数据绑定的入口。

## Observer

> 源码路径： src/core/observer/index.js

**内部调用顺序**：`function observe` ☞  为value创建观察者，如果该值已有观察者则返回原有的，否则创建一个新的 ☞ `class Observer` ☞ 如果是数组，进行数组的操作，否则调用 `walk` 方法 ☞ 遍历数据对象，对每个属性进行劫持。

```js
/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 * 遍历所有属性并将它们转换为 getter /setters。此方法只应在值类型为对象的时候
 */
walk (obj: Object) {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i])
  }
}
```

```js
/**
 * Define a reactive property on an Object.
 * 在对象上定义响应属性
 * @param {obj} 监测属性的对象
 * @param {key} 监测的属性key
 * @param {val} 给key对应的值设置默认值
 * @param {customSetter} 自定义的setter方法
 * @param {shallow} 是否不进行深度监测
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean 
) {
  // 创建依赖对象 源码 ./dep.js
  const dep = new Dep()

  // 获取对象上该属性的自有属性对应的属性描述符，如果不存在或者被设置为不可修改时，则直接return
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  // 为预定义getter/setter提供所需
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  // 通过Object.defineProperty 来重写set 和get 方法，
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      // 首先获取当前属性的值
      const value = getter ? getter.call(obj) : val
      // 这里的Dep.target===watcher就是当前属性的wather实例 -- 如果不理解可以继续看它到底是什么？ 
      if (Dep.target) {
        // 往dep数组中添加自己  
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      // 获取该属性原有的值
      const value = getter ? getter.call(obj) : val
  
      // 如果新值等于旧值，则直接return
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      // 如果不是生产环境且自定义setter方法存在，则执行该方法
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // 如果没有setter，则直接return
      if (getter && !setter) return
      // 有setter则调用
      if (setter) {
        setter.call(obj, newVal)
      } else {
        // 设置新值
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      // dep发送通知
      dep.notify()
    }
  })
}
```

`defineReactive()`方法为重写对象属性的函数，重写`set`和`get`方法。`get`方法中将该属性的`watcher`实例添加到`dep`的依赖数组中；`set`方法中通过`dep`发送通知。

## Dep

> 源码路径：src/core/observer/dep.js

```js
/**
 * A dep is an observable that can have multiple directives subscribing to it.
 * dep是一个观察者，可以被多个指令订阅它
 * @property {target} watcher实例
 * @property {id} id
 * @property {subs} 依赖数组 存放订阅者
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  // 初始化
  constructor () {
    this.id = uid++
    this.subs = []
  }
  // 添加订阅者
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
  // 删除订阅者
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }
  // 依赖 
  depend () {
    // Dep.target === watcher
    if (Dep.target) {
      // 链接 ./wather.js ☞ addDep
      Dep.target.addDep(this)
    }
  }
  // 通知
  notify () {
    // stabilize the subscriber list first
    // 首先获取sub数组
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async we need to sort them now to make sure they fire in correct order
      // 如果不运行异步我们需要对它们进行排序，以确保它们按正确的执行顺序，那么子系统在调度程序中是不排序的。
      subs.sort((a, b) => a.id - b.id)
    }
    // 遍历sub数组，逐个调用数组元素watcher实例的update方法
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```

`Dep`的主要作用就是`Watcher`的依赖，用于缓存和操作`watcher`实例。

## Watcher

> 源码路径：src/core/observer/watcher.js

```js

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 * 观察解析表达式，收集依赖项和在表达式值发生变化时执行回调函数。它同时被应用于$wather() api 和指令中。
 */
export default class Watcher {
	// ...省略内部属性声明

  constructor (
    vm: Component, // vm实例
    expOrFn: string | Function,  // 键路径
    cb: Function,   // 回调函数
    options?: ?Object,  // 配置项
    isRenderWatcher?: boolean // 是否为渲染观察者
  ) {
 		// 省略内部属性初始化
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get () {
    // 调用dep中的方法，链接 ./dep.js ☞ pushTarget
    // 设置Dep.target == watcher,并往target栈中添加watcher
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      // 触摸每个属性，以便将它们作为依赖项进行跟踪，以便进行深度监视
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  /**
   * Add a dependency to this directive.
   * 添加该指令的依赖项
   */
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        // 添加到dep依赖数组中
        dep.addSub(this)
      }
    }
  }

  /**
   * Clean up for dependency collection.
   * 清理依赖项集合
   */
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  /**
   * Subscriber interface. 订阅者接口
   * Will be called when a dependency changes.
   * 将在依赖项被更改时调用
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      // 如果设置延迟，则将dirty设为true
      this.dirty = true
    } else if (this.sync) {
      // 如果是同步的，立即执行
      this.run()
    } else {
      // 否则，通过批处理处理观察者
      queueWatcher(this)
    }
  }

  /**
   * Scheduler job interface. // 调度器工作接口
   * Will be called by the scheduler.
   * 将被调度器调用
   */
  run () {
    if (this.active) {
      // 获取观察的属性的值
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        // 在对象/数组上的深层观察者和观察者即使在值相同的情况下也会执行，因为该值可能已经发生了突变。
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        if (this.user) {
          try {
            // 尝试执行观察者的回调函数
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  /**
   * Remove self from all dependencies' subscriber list.
   * 清除所有的观察者
   */
  teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      // 从vm实例的Watcher列表中删除自己，这是一个有点昂贵的操作，所以如果VM正在被销毁的时候我们跳过它，。
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}

```

**Wather**是发布者订阅者模式中的订阅者，是`Observe`和`compile`之间的栋梁。

## Compiler

> 源码路径： src/compiler/*.js

Vue的模板编译是一个很复杂的过程，主要功能是**解析模板指令**，将模板中的变量替换数据，然后初始化渲染页面视图，并将每个执行对象的节点绑定更新函数，添加监听数据的订阅者，一旦数据变化没收到通知就更新视图。具体的实现方式将在[Vue的Compiler编译](src/compiler)篇详细说明。这里只实现一个简易的编译方式。

```js
function Compile(node, vm) {
      if(node) {
        this.$frag = this.nodeToFragment(node, vm);
        return this.$frag;
      }
    }
    Compile.prototype = {
      nodeToFragment: function(node, vm) {
        var self = this;
        var frag = document.createDocumentFragment();
        var child;

        while(child = node.firstChild) {
          self.compileElement(child, vm);
          frag.append(child); // 将所有子节点添加到fragment中 将node削减firstchild
        }
        return frag;
      },
      compileElement: function(node, vm) {
        var reg = /\{\{(.*)\}\}/;

        //节点类型为元素
        if(node.nodeType === 1) {
          var attr = node.attributes;
          // 解析属性
          for(var i = 0; i < attr.length; i++ ) {
            if(attr[i].nodeName == 'v-model') {
              var name = attr[i].nodeValue; // 获取v-model绑定的属性名
              node.addEventListener('input', function(e) {
                // 给相应的data属性赋值，进而触发该属性的set方法
                 vm[name] = e.target.value;
              });
              // node.value = vm[name]; // 将data的值赋给该node
              new Watcher(vm, node, name, 'value'); // 通过创建Watcher实例 将数据更新到dom
            }
          };
        }
        //节点类型为text
        if(node.nodeType === 3) {
          if(reg.test(node.nodeValue)) {
            var name = RegExp.$1; // 获取匹配到的字符串
            name = name.trim();
            // node.nodeValue = vm[name]; // 将data的值赋给该node
            new Watcher(vm, node, name, 'nodeValue');
          }
        }
      },
    }
```

##  总结

具体代码查看[简易版双向数据绑定](https://github.com/Jokul518/fe-growth-path/tree/master/简易版MVVM)

## 总结

Vue双向数据绑定通过`defineReactive`方法，使用`Object.defineProperty()`劫持对象的取值赋值，添加订阅者`watcher`到主题对象`Dep`，确保只有同一个变量只有一个`watcher`添加到`dep`数组中。☞ `dep`中往`dep`数组中添加`watcher`和监听`dep`中的每一个`watcher`。☞ `Watcher`是将模板和`Observer`对象结合在一起的纽带。`Watcher`是订阅者模式中的订阅者。`update`是将更新操作添加到批处理中进行操作，用来提高性能。`cb`是批处理的回调。☞`Compile`用来接受Watcher的通知，将修改的数据的通过生成虚拟`dom`，然后转成真实`dom`，表现到页面上。

## 代码

[简易版MVVM](https://github.com/Jokul518/fe-growth-path/tree/master/%E7%AE%80%E6%98%93%E7%89%88MVVM)