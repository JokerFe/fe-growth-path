[toc]

## vue双向数据绑定原理

> Vue双向数据绑定通过`defineReactive`方法，使用`Object.defineProperty()`劫持对象的取值赋值，添加订阅者`watcher`到主题对象`Dep`，确保只有同一个变量只有一个`watcher`添加到`dep`数组中。☞ `dep`中往`dep`数组中添加`watcher`和监听`dep`中的每一个`watcher`。☞ `Watcher`是将模板和`Observer`对象结合在一起的纽带。`Watcher`是订阅者模式中的订阅者。`update`是将更新操作添加到批处理中进行操作，用来提高性能。`cb`是批处理的回调。☞`Compile`用来接受Watcher的通知，将修改的数据的通过生成虚拟`dom`，然后转成真实`dom`，表现到页面上。

1. vue是采用数据劫持结合发布者-订阅者模式的方法，通过`Object.defineProperty()`来劫持各个属性的setter、getter，在数据变动时发布消息给订阅之，触发相应的监听事件。主要有watcher、dep、observer和complier四块。
2. 第一步：需要observe的数据对象进行递归遍历，包括子属性对象的属性，都加上setter和getter，这样给任何值赋值是都会触发setter，就能进行数据变化的监听
3. 第二步：compile解析模板指令，将模板中的变量替换数据，然后初始化渲染页面视图，并将每个执行对象的节点绑定更新函数，添加监听数据的订阅者，一旦数据变化没收到通知就更新视图。
4. 第三步：watcher订阅者是Observe和compile之间的栋梁；①在自身实例化时往属性订阅器dep里添加自己②自身必须有一个update方法③带属性变动dep.notice()通知时，能调用自身的update方法，并触发compile中绑定的回调
5. 第四步：MVVM作为数据绑定的入口，整合observe和compile和watcher三者，通过observe来监听自己的数据变化，通过compile来解析末班执行，最终利用watcher搭起observe和compile之间的通信，达到数据变化就更新视图，视图交互就更新数据的效果
6. 注意：`Object.defineProperty()`只能更新data已有数据的setter和getter，如果给data挂载新的属性时，需手动添加到dep和数据监听。
7. 流程：通过defineReactive方法，使用`Object.defineProperty()`劫持对象的取值赋值，添加订阅者watcher到主题对象Dep，确保只有同一个变量只有一个watcher添加到dep数组中。☞ dep中往dep数组中添加watcher和监听dep中的每一个watcher。☞ Watcher是将模板和Observer对象结合在一起的纽带。Watcher是订阅者模式中的订阅者。update是将更新操作添加到批处理中进行操作，用来提高性能。cb是批处理的回调。☞`Compile`用来接受Watcher的通知，将修改的数据的通过生成虚拟dom，然后转成真实dom，表现到页面上。☞ 这里使用一个while循环，避免使用递归碰到大量的node节点，出现性能瓶颈。

## 数组的重写

当通过` Object.defineProperty`对对象和数组进行劫持setter、getter方法时，只能对对象和数组内原有属性的劫持，如果新增属性，需要重新劫持，调用`defineReactive`方法，添加watcher和dep。需要注意的是当对已有属性进行修改时，会调用setter和getter方法，` Object.defineProperty`监听数组时，可以理解为将数组的下标当做对象的key来处理的，所以当数组处理操作涉及到下标时就会出现性能问题。

数组的那些操作会触发呢？`push`、`pop`、`shift`、`unshift`、`splice`、`sort`、`reverse`这7个方法会造成严重的性能问题，所以这里修改了数组的这些方法的处理方式，劫持方法，手动给新元素添加监听。

```javascript
[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  /*将数组的原生方法缓存起来，后面要调用*/
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator () {
    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    let i = arguments.length
    const args = new Array(i)
    while (i--) {
      args[i] = arguments[i]
    }
    /*调用原生的数组方法*/
    const result = original.apply(this, args)

    /*数组新插入的元素需要重新进行observe才能响应式*/
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
        inserted = args
        break
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 如果存在参数，就手动给数组新元素手动添加observer
    if (inserted) ob.observeArray(inserted)
      
    // notify change
    /*dep通知所有注册的观察者进行响应式处理*/
    ob.dep.notify()
    return result
  })
})

// ob.observeArray() 调用array.js中的方法  86行
/**
   * Observe a list of Array items.
   */
/*对一个数组的每一个成员进行observe*/
observeArray (items: Array<any>) {
  for (let i = 0, l = items.length; i < l; i++) {
    /*数组需要遍历每一个成员进行observe*/
    observe(items[i])
  }
```

## 生命周期

Vue 生命周期 的几个阶段

**`实例化阶段`**

- beforeCreated （无法使用data）
- created （还未渲染dom，可以使用nextTick来操作dom）

**`挂载阶段`**

- beforeMounted （实例化完成，dom挂载前，可使用data）
- mounted （dom挂载，可使用data，也可直接操作dom）

**`更新阶段`**

- beforeUpdate
- update

**`销毁阶段`**

- beforeDestory
- destory

两个特殊的（keep-alive 专属）：

- activited 组件被激活时调用
- deactivated 组件被销毁时调用

🍊 具体描述

| 生命周期      | 描述                                                         |
| :------------ | :----------------------------------------------------------- |
| beforeCreate  | 组件实例被创建之初，组件的属性生效之前                       |
| created       | 组件实例已经完全创建，属性也绑定，但真实 dom 还没有生成，$el 还不可用 |
| beforeMount   | 在挂载开始之前被调用：相关的 render 函数首次被调用           |
| mounted       | el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子    |
| beforeUpdate  | 组件数据更新之前调用，发生在虚拟 DOM 打补丁之前              |
| update        | 组件数据更新之后                                             |
| beforeDestory | 组件销毁前调用                                               |
| destoryed     | 组件销毁后调用                                               |

🍊 父子组件生命周期调用顺序

- 父组件beforeCreated
- 父组件created
- 父组件beforeMounted
- 子组件beforeCreated
- 子组件created
- 子组件beforeMounted
- 子组件mounted
- 父组件mounted

## 组件通讯方式

- `v-model`: v2.2+新增的，默认利用value的prop和input的事件实现的，但是为了避免单选框、复选框和这些属性名发生冲突，可以通过model对象进行方法名和事件的重命名，注意需要在props中声明一下这个更改后的名字。

  - ```js
    Vue.component('base-checkbox', {
      model: {
        prop: 'checked',
        event: 'change'
      },
      props: {
        checked: Boolean
      },
      template: `
        <input
          type="checkbox"
          v-bind:checked="checked"
          v-on:change="$emit('change', $event.target.checked)"
        >
      `
    })
    ```

- `.sync`: v2.0删除，v2.3+又新增的。可以简化子组件修改父组件传入props值

  - ```js
    // 1、父组件上的字组件监听自定义事件并让property值n等于传递过来的$event
    v-on:update:n='n=$event'
    // 2、子组件内的代码点击后触发自定义事件并传递一个参数，参数为msg-1
    @click="$emit('update:n',msg-1)"
    // 那么，我们可以不可以简化代码呢？
    // vue很贴心地为我们做了相关工作，那就是.sync修饰符
    // 使用方法：
    // 在父组件上告诉子组件传递过去的msg跟父组件上的n保持同步，相当于允许它修改
    <child :msg.sync='n'></child>
    // 在子组件上的代码写为：
    <button @click="$emit('update:msg',msg-1)">子组件点击{{msg}}</button>
    // 使用.sync后写法需要注意的是：eventName只能采用update:传递过来的prop属性的方式才行。
    ```

- `prop`

- `v-on $emit`

- `$on $emit`

- `$attrs $listeners`
  - $attrs：包含了父作用域中不被 prop 所识别 (且获取) 的特性绑定 ( class 和 style 除外 )。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 ( class 和 style 除外 )，并且可以通过 v-bind="$attrs" 传入内部组件。通常配合 inheritAttrs 选项一起使用。
  - $listeners：包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件

- `provide inject`
  - 祖先组件中通过 provider 来提供变量，然后在子孙组件中通过 inject 来注入变量。 provide / inject API 主要解决了跨级组件间的通信问题，不过它的使用场景，主要是子组件获取上级组件的状态，跨级组件间建立了一种主动提供与依赖注入的关系。

- `eventBus`：这种方法通过一个空的 Vue 实例作为中央事件总线（事件中心），用它来触发事件和监听事件，从而实现任何组件间的通信，包括父子、隔代、兄弟组件。

- `vuex`：Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。 改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化。

## v-for添加key的作用

key的主要作用时用来`提高渲染性能`的。使用key给每个节点做一个唯一标识，在进行DOM Diff算法时就可以直接精准的确定此节点，找到正确的位置插入新的节点，就是为了高效的更新虚拟DOM。

不建议使用index作为key的原因

1. 造成多余的节点更新
2. 造成意外的页面显示错误

原因：`在插入数据或者删除数据的时候，会导致后面数据的key绑定的index变化，从而导致重新渲染，效率降低`

## Computed和watch的区别

computed 计算属性

1. 依赖于某些值返回一个值，可以设置set和get方法
2. 有缓存，依赖的值没有变化，就不会重新计算

watch 监听属性

1. 监听一个值的变化，当监听的值发生变化时，可执行相关动作
2. 可深度监听多层对象，`deep:true`
3. 可设置立即执行，`immediate:true`,即组件初始化时立即执行被监听的值得相关动作

使用场景

* 当需要进行数值计算，并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时，都要重新计算；
* 当需要在数据变化时执行某些操作时，应该使用 watch

## watch、$watch、computed

watch

原理就是调用了$watch对内部所有的方法就行监听。

$watch

它允许观察对象的某个属性，当属性变化时执行回调。接受三个参数：expOrFn（要观测的属性），cb(回调函数)，options(可选的配置对象)。

它的本质就是创建了一个Watcher实例

computed

实质上也是创建了一个Watcher实例

当模板中的某个值需要通过一个或多个数据计算得到时，就可以使用计算属性，还有计算属性的函数不接受参数；监听属性主要是监听某个值发生变化后，对新值去进行逻辑处理。

## directives

> 除了核心功能默认内置的指令 (`v-model` 和 `v-show`)，Vue 也允许注册自定义指令。注意，在 Vue2.0 中，代码复用和抽象的主要形式是组件。然而，有的情况下，你仍然需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令。

钩子函数

* `bind`：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
* `inserted`：被绑定元素插入父节点时调用（仅保证父节点存在，但不一定已被插入文档中）。
* `update`：所在组件的VNode更新时调用，**但是可能发生在其子VNode更新之前调用**。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新。
* `componentUpdate`：指令所在组件的VNode及其子VNode全部更新后调用。
* `unbind`：只调用一次，指令与元素解绑时调用。

## Vue use方法的作用及原理

> **vue.use()往全局注入一个插件，供全局真接使用, 不需要单独引用**

- 通过全局方法 Vue.use() 使用插件。它需要在你调用 new Vue() 启动应用之前完成。
- Vue.use 会自动阻止多次注册相同插件，届时即使多次调用也只会注册一次该插件。

> Vue.use() 方法至少传入一个参数，该参数类型必须是 Object 或 Function，如果是 Object 那么这个 Object 需要定义一个 install 方法，如果是 Function 那么这个函数就被当做 install 方法。在 Vue.use() 执行时 install 会默认执行，当 install 执行时第一个参数就是 Vue，其他参数是 Vue.use() 执行时传入的其他参数。就是说使用它之后调用的是该组件的install 方法。

```js
import { toArray } from "../util/index";

// 定义了Vue.use 方法，用于安装插件
export function initUse(Vue: GlobalAPI) {
	Vue.use = function (plugin: Function | Object) {
		const installedPlugins =
			this._installedPlugins || (this._installedPlugins = []);

		// 避免重复安装同一个插件
		if (installedPlugins.indexOf(plugin) > -1) {
			return this;
		}

		const args = toArray(arguments, 1);
		args.unshift(this);
		// 可以看出，如果Vue.use传入的是一个对象，那么会执行他的install方法
		if (typeof plugin.install === "function") {
			plugin.install.apply(plugin, args);
		} else if (typeof plugin === "function") {
			// 如果传入的就是一个函数，那么直接执行这个函数
			plugin.apply(null, args);
		}
		// 缓存已经安装过的插件，避免重复安装
		installedPlugins.push(plugin);
		return this;
	};
}
```

## 批处理

```javascript
/**
 * 批处理构造函数
 * @constructor
 */
function Batcher() {
    this.reset();
}

/**
 * 批处理重置
 */
Batcher.prototype.reset = function () {
    this.has = {};
    this.queue = [];
    this.waiting = false;
};

/**
 * 将事件添加到队列中
 * @param job {Watcher} watcher事件
 */
Batcher.prototype.push = function (job) {
    if (!this.has[job.name]) {
        this.queue.push(job);
        this.has[job.name] = job;
        if (!this.waiting) {
            this.waiting = true;
            setTimeout(() => {
                this.flush();
            });
        }
    }
};

/**
 * 执行并清空事件队列
 */
Batcher.prototype.flush = function () {
    this.queue.forEach((job) => {
        job.cb();
    });
    this.reset();
};
```

1. 在事件initialize阶段，一个update queue被创建。在事件中调用setState方法时，状态不会被立即调用， 而是被push进Update queue中。 

2. 函数执行结束调用事件的close阶段，Update queue会被flush，这是新的状态才会被应用到组件上并开始后续的Virtual DOM更新，biff算法来对model更新。 

3. 当model被修改时，对应的watcher会被推入Update queue， 与此同时还会在异步队列中添加一个task用于flush 当前的Update queue。 

4. 这样一来，当前的task中的其他watcher会被推进同一个Update queue中。当前task执行结束后，异步队列下一个 task执行，update queue  会被 flush，并进行后续的更新操作。 

5. 会被 flush，并进行后续的更新操作。 

6. 为了让 flush 动作能在当前 Task 结束后尽可能早的开始，Vue 会优先尝试将任务 micro-task 队列，具体来说， 在浏览器环境中 Vue 会优 

7. 先尝试使用 MutationObserver API 或 Promise，如果两者都不可用，则 fallback 到 setTimeout。 

## 内置指令

1. `v-once`：定义它的元素或组件只渲染一次 包括元素或组件的所有子节点 首次谊染后 不再随数据的变化重新渲染 将被视为静态内容
2. `v-cloak`：这个指令保持在元素上直到关联实例结束编译--解决初始化慢导致页面闪动的最佳实践
3. `v-bind`：绑定属性，动态更新HTML元素上的属性例如`v-bind:class`
4. `v-on`：用于监听DOM事件例如`v-on:click v-on:keyup`
5. `v-html`：赋值就是变量innerHTML--注意防上xss攻击
6. `v-text`：更新元素的`textContent`
7. `v-model`：
8. `v-if/v-else/v-else-if`：条件语句
9. `v-show`：通过css的display的方式控制显示隐藏
10. `v-for`：循环
11. `v-pre`：跳过这个元素以及子元素的编译过程，以此来加快整个项目的编译速度

## nextTick

> 在下次DOM更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的DOM。

🍊 用途

1. created、mounted

在这两个生命周期钩子函数中如果需要操作渲染后的视图，需要使用nextTick方法。

> 注意 mounted 不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用 vm.$nextTick 替换掉 mounted

2. 获取`v-if`或`v-show`显示元素及其属性

```js
this.showMe = true;
this.$nextTick(()=>{
        //dom元素更新后执行，此时能拿到showMe控制显示的p元素的属性
        this.message = this.$refs.myWidth.offsetWidth;
  })
```

从源码中可以看出，nextTick主要分为三部分：

1. 处理callbacks函数；
2. nextTick的降级兼容策略，Promise --> MutationObserver --> setImmediate --> 宏任务 setTimeout 0；
3. nextTick主函数。

主要执行过程：

1. 利用闭包的原理保存了各个回调函数的引用，然后放入callbacks数组中；
2. 如果当前队列还未执行回调，那么开始执行回调，并标记当前任务队列已经执行过回调；
3. 最后判断当前浏览器具有Promise环境且为传递回调函数则采用Promise执行。

nextTick的降级兼容策略 

`Promise` --> `MutationObserver` --> `setImmediate` --> `宏任务 setTimeout 0`

MutationObserver 概述

* 监视 DOM 变动的接口当监视的 DOM 发生变动时 MutationObserver 将收到通知并触发事先设定好的回调函数。

* 类似于事件，但是异步触发。添加监视时，MutationObserver 上的 observer 函数与 addEventListener 有相似之处，但不同于后者的同步触发，MutationObserver是异步触发，此举是为了避免 DOM 频繁变动导致回调函数被频繁调用，造成浏览器卡顿。

## keepalive

> keepalive是vue内置的一个组件，可以使被包含的组件**保留状态**，或者**避免重新渲染**。简单的说就是**组件缓存**

`keepalive`组件提供了三个属性作为组件缓存的匹配规则：

* `include` 包含的组件(name或者tag)，可为字符串、数组和正则表达式
* `exclude` 不包含的组件，可为字符串、数组和正则表达式，优先级大于`include`
* `max`缓存组件的最大数量，可为字符串和数字

主要逻辑

1. 判断组件`name` 不在`include`或者在`exclude`中，直接返回`vnode`，说明该组件不被缓存。
2. 获取组件实例`key`，如果有获取实例的`key`，否则重新生成。
3. key生成规则：`cid + "::"+ tag`，仅靠cid是不够的的，因为相同的构造函数可以注册为不同的本地组件。
4. 如果缓存对象内存在，则直接从缓存对象中获取组件实例给`vnode`，不存在则添加到缓存对象中。
5. 最大缓存数量：当缓存组件数量超过`max`值时，清除`keys`数组内第一个组件。
6. **缓存清除规则**：当`cache`内原有组件被使用时会将该组件`key`从`keys`数组中删除，然后`push`到`keys`数组最后，以便清除最不常用组件。

```js
export default {
  name: 'keep-alive',
  abstract: true, // 是否为抽象组件
  // 可接受的三个参数
  props: {
    include: patternTypes,  // 包含的白名单组件  调用matches进行组件name匹配
    exclude: patternTypes,  // 不包含的组件名  调用matches进行组件name匹配
    max: [String, Number]   // 最大缓存数量
  },


  created () {
    this.cache = Object.create(null) // 缓存数组
    this.keys = []
  },

  // destroyed 钩子中销毁cache对象中所有的组件实例
  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },
  // 监听include和exclude的变化，修改时修正cache
  mounted () {
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },
   
  render () {
    // 获取slot插槽中第一个组件
    const slot = this.$slots.default
    const vnode: VNode = getFirstComponentChild(slot)
    // componentOptions 组件的配置信息 包含了vm实例上的所有内容 具体属性查看路径  /flow/optiopns中的ComponentOptions
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      //  获取组件name or tag
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      // 判断name 不在include或者在exclude中  直接返回vnode 表示没有缓存
      if (
        (include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      // 创建唯一的key 仅仅cid是不够的，因为相同的构造函数可以注册为不同的本地组件
      const key: ?string = vnode.key == null
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      // 如果缓存对象内存在，则直接从缓存中获取组件实例给vnode，不存在的话则加入到缓存对象内
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        remove(keys, key)
        keys.push(key)
      } else {
        cache[key] = vnode
        keys.push(key)
      
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }
      /* keepAlive标记位 */
      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
```

方法解读

* `getComponentName`: 获取组件`name`或`tag`，首先获取`name`，用于缓存组件匹配。
* `matches`：检测`name`是否符合匹配规则，用于判断组件`name`是否符合`include`或者`exclude`规则。
* `pruneCache`：修正`cache`数组内容，遍历`cache`对象内的所有缓存组件，根据匹配规则，销毁不符合组件。
* `pruneCacheEntry`：销毁`vnode`对应的组件实例，调用的是组价实例的`$destroy()`方法进行销毁。

## DOM DIFF流程

1. 借助双向数据绑定的响应式数据的监听，当数据发生变化时，借助set事件的劫持，通过Dep.notify方法广播通知

2. 触发vm的实例方法`_update`方法来触发Dom Diff的`__patch__`

3. `patch`：主要判断节点的变化，删除、新增还是变化

   * 如果新节点不存在，则直接销毁旧节点，使用`invokeDestroyHook`函数递归清除

   * 如果旧节点为空，则说明是新增节点

   * 通过**`sameVnode`**和` isDef(oldVnode.nodeType)`判断是同一个节点，不是同一节点直接替换，否则调用`patchNode`进行比对更新

   * ```js
     // 判断节点是否相同
     function sameVnode(a, b) {
       return (
         a.key === b.key && (
           (
             a.tag === b.tag &&
             a.isComment === b.isComment &&
             isDef(a.data) === isDef(b.data) &&
             sameInputType(a, b)
           ) || (
             isTrue(a.isAsyncPlaceholder) &&
             a.asyncFactory === b.asyncFactory &&
             isUndef(b.asyncFactory.error)
           )
         )
       )
     }
     ```

4. `patchVnode`: 详细的判断节点更精准的变化
   1. 找到对应的真实dom，称为`el`
   2. 判断`Vnode`和`oldVnode`是否指向同一个对象，如果是，那么直接`return`
   3. 如果他们都有文本节点并且不相等，那么将`el`的文本节点设置为`Vnode`的文本节点。
   4. 如果`oldVnode`有子节点而`Vnode`没有，则删除`el`的子节点
   5. 如果`oldVnode`没有子节点而`Vnode`有，则将`Vnode`的子节点真实化之后添加到`el`
   6. 如果两者都有子节点，则执行`updateChildren`函数**比较子节点** 

5. `updateChildren`函数为domdiff的核心，新旧开始指针☞新旧结束指针☞旧开始指针与新结束指针☞旧结束指针与新开始指针☞从旧节点中查找新增、删除、移动。
   1. 创建了四个指针，新旧`dom`的开始结束下标和`node`。
   2. 先比较新旧的开始节点，如果相同则`patchVnode`这两个节点，然后指针后移 
   3. 如果不相同，则比较新旧结束节点，如果相同，`patchVnode`这两个节点，然后指针前移 
   4. 如果依然不同，则比较旧开始和新结束节点，如果相同，`patchVnode`这两个节点，旧开始节点后移，新结束节点前移 
   5. 如果依然不同，则比较旧结束和新开始节点，如果相同，`patchVnode`这两个节点，旧结束节点前移，新开始节点后移 
   6. 如果依然不同，进行最复杂的比对方式。创建旧`dom`的key值map，判断新开始节点的key是否在旧`dom`中，不存在就手动去遍历旧`dom`查找下标，如果不存在就新增，插入到旧开始指针前边。如果找到，则取出这个节点，与新开始节点比较是否为同一个节点(`sameVNode`)。相同，`patchVnode`这两个节点，在旧`dom`中删除这个节点，然后指针移动；不相同，则为新增节点。
   7. 2-6方法是循环进行的，这个`while`的出口为开始结束指针的重叠。
   8. 通过`patchVnode`函数可以看出来`Vue`的`DomDiff`是**深度递归遍历**的。
   9. **总结：**每次`Diff`都会调用`updateChildren`方法来比较，就这样层层递归下去，直到将旧`VNode`和新`VNode`中的所有子节点比对完。`DomDiff`的过程更像是两个树的比较，每找到相同节点时，都会一层一层的往下比较它们的子节点，是一个**深度递归遍历比较**的过程。

## Virtual DOM

从本质上来说，Virtual Dom是一个JS对象，通过对象的方式来表示DOM结构。将页面的状态抽象为JS对象的形式，配合不同的渲染工具，使跨平台渲染成为可能。通过事务处理机制，将多次DOM修改的结果一次性的更新到页面上，从而**有效的减少页面渲染的次数，减少修改DOM的重绘重排次数，提高渲染性能**。

具体代码太多，这里不做全部全部展示，只是介绍几个核心的属性：

* `tag` ：当前`vnode`的标签属性

* `data` ：包含了最后渲染成真实`dom`节点后，节点上的`class`，`attribute`，`style`以及绑定的事件

* `children` ：包含当前`vnode`的所有子节点

* `text` ：文本属性

* `elm` 为这个`vnode`对应的真实`dom`节点

* `key` ：`vnode`的标记，在`diff`过程中可以提高`diff`的效率

Vue创建Vnode的流程为：

1. 在Vue构造函数中调用内部的`_init`方法
2. `_init`内部根据参数的el元素调用 `$mount` 实例方法去挂载 `dom` 
3. `$mount` 实例方法实际上继续调用`mountComponent`方法
4. `mountComponent`方法内部实例化一个渲染Watcher，在它的回调函数中会调用 `updateComponent` 方法 
5. `updateComponent`内调用 `vm._render` 方法先生成虚拟 Node，最终调用 `vm._update` 更新 `DOM`
6. `vm._render` 调用 `createElement` 方法来生成 vnode
7. `createElement`通过上下文环境、标签名、数据、子组件等参数来创建Vnode

## 真实DOM VS Virtual DOM

为什么要用 Virtual DOM ？

🍊 保证性能下限，在不进行手动优化的情况下，提供过得去的性能

先说一下页面渲染的一个流程：

>  解析HTNL ☞ 生成DOM🌲 ☞ 生成 CSSOM ☞ Layout ☞ Paint ☞ Compiler

下面对比一下修改DOM时真实DOM操作和Virtual DOM的过程，来看一下它们重排重绘的性能消耗：

**真实DOM**： 生成HTML字符串 + 重建所有的DOM元素

**Virtual DOM**： 生成vNode + DOMDiff + 必要的dom更新

Virtual DOM的更新DOM的准备工作耗费更多的时间，也就是JS层面，相比于更多的DOM操作它的消费是极其便宜的。尤雨溪在社区论坛中说道： **框架给你的保证是，你不需要手动优化的情况下，我依然可以给你提供过得去的性能。**

🍊  跨平台

Virtual DOM本质上是JavaScript的对象，它可以很方便的跨平台操作，比如服务端渲染、uniapp等。

Virtual DOM真的比真实DOM性能好吗？

1.  首次渲染大量DOM时，由于多了一层虚拟DOM的计算，会比innerHTML插入慢。

2.  正如它能保证性能下限，在真实DOM操作的时候进行针对性的优化时，还是更快的。

## vue编译原理

complier

vue的模板编译是发生在`$mount`之后，通过complie方法，经过parse、optimize、generate方法，最后生成render函数来生成虚拟dom，虚拟dom通过diff算法来更新dom。

具体功能如下：

* parse函数解析template，将template转成ast
* optimize函数优化静态资源
* generate函数创建render函数字符串

生成render函数之后就会调用new Watcher函数，用来监听数据的变化，render函数就是数据监听的回调所调用的，结果就是重新生成vnode。

当这个 render 函数字符串在第一次 mount、或者绑定的数据更新的时候，都会被调用，生成 Vnode。

## 组件中的data为什么是一个函数而不是一个对象

因为如果data是一个对象则会造成数据共享，在多次使用该组件时，改变其中一个组件的值会影响全部该组件的值。而如果是通过函数的形式返回出一个对象的话，在每次使用该组件时返回出的对象的地址指向都是不一样的，这样就能让各个组件的数据独立。

> 因为对象是一种引用数据类型，在内存中只有一份。如果data的值直接是一个对象的话，那么后期组件在不同的地方多次调用的时候，会互相产生影响，因为每次调用操作data对象都是一样的。使用函数的方式返回对象，可以保证组件的每一次调用都会创建一个新对象，这样组件的每一次调用就不会相互产生影响。

> 组件中的 data 写成一个函数，数据以函数返回值形式定义，这样每复用一次组件，就会返回一份新的 data，类似于给每个组件实例创建一个私有的数据空间，让各个组件实例维护各自的数据。而单纯的写成对象形式，就使得所有组件实例共用了一份 data，就会造成一个变了全都会变的结果。

> 官方答案：当一个组件被定义， data 必须声明为返回一个初始数据对象的函数，因为组件可能被用来创建多个实例。如果 data 仍然是一个纯粹的对象，则所有的实例将共享引用同一个数据对象！通过提供 data 函数，每次创建一个新实例后，我们能够调用 data 函数，从而返回初始数据的一个全新副本数据对象。

> 具体原因：对象为引用类型，当重用组件时，由于数据对象都指向同一个data对象，当在一个组件中修改data时，其他重用的组件中的data会同时被修改；而使用返回对象的函数，由于每次返回的都是一个新对象（Object的实例），引用地址不同，则不会出现这个问题

## Vue的SEO优化

🍊 SSR服务器渲染

权衡之处：

1. 开发条件所限，浏览器特定的代码，只能在某些生命周期钩子函数 (lifecycle hook) 中使用；一些外部扩展库(external library)可能需要特殊处理，才能在服务器渲染应用程序中运行；
2. 环境和部署要求更高，需要 Node.js server 运行环境；
3. 高流量的情况下，请准备相应的服务器负载，并明智地采用缓存策略。

优势：

1. 更好的 SEO，由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面；
2. 更快的内容到达时间(time-to-content)，特别是对于缓慢的网络情况或运行缓慢的设备。

不足：

1. 一套代码两套执行环境，会引起各种问题，比如服务端没有 window、document 对象，处理方式是增加判断，如果是客户端才执行；
2. 引用 npm 包，带有 dom 操作的，例如：wowjs，不能用import 的方式；
3. Nuxt asyncData 方法，初始化页面前先得到数据，但仅限于页面组件调用。

🍊 Nuxt静态化

静态化是 Nuxtjs 打包的另一种方式，算是 Nuxtjs 的一个创新点，页面加载速度很快。

> 在Nuxtjs 执行 generate 静态化打包时，动态路由会被忽略。

如果你的动态路由的参数很多，例如商品详情，可能高达几千几万个。需要一个接口返回所有 id，然后打包时遍历 id，打包到本地，如果某个商品修改了或者下架了，又要重新打包，数量多的情况下打包也是非常慢的，非常不现实。

优势：

1. 纯静态文件，访问速度超快；
2. 对比 SSR，不涉及到服务器负载方面问题；
3. 静态网页不宜遭到黑客攻击，安全性更高。

不足：

1. 如果动态路由参数多的话不适用。 

🍊  预渲染 `prerender-spa-plugin`

如果你只是用来改善少数营销页面（例如`/`，`/about`, `/contact` 等）的 SEO，那么你可能需要预渲染。无需使用 web 服务器实时动态编译 HTML，而是使用预渲染方式，在构建时(`build time`) 简单地生成针对特定路由的静态 HTML 文件。优点是设置预渲染更简单，并可以将你的前端作为一个完全静态的站点。

优势：

改动小，引入插件配置即可

不足：

1. 无法使用动态路由
2. 只适用少量页面的项目，页面多达几百个的情况下，打包会非常慢

🍊 使用 `Phantomjs` 针对爬虫做处理

`Phantomjs` 是一个基于 `webkit` 内核的无头浏览器，即没有 UI界面，即它就是一个浏览器，只是其内的点击、翻页等人为相关操作需要程序设计实现。
虽然`PhantomJS 宣布终止开发`，但是已经满足对 Vue 的 SEO 处理。
这种解决方案其实是一种旁路机制，原理就是通过` Nginx` 配置，判断访问的来源 UA 是否是爬虫访问，如果是则将搜索引擎的爬虫请求转发到一个` node server`，再通过 PhantomJS 来解析完整的 HTML，返回给爬虫。

优势：

1. 完全不用改动项目代码，按原本的SPA 开发即可，对比开发 SSR 成本小不要太多；
2. 对已用 SPA 开发完成的项目，这是不二之选。

不足：

1. 部署需要 node 服务器支持；
2. 爬虫访问比网页访问要慢一些，因为定时要定时资源加载完成才返回给爬虫；
3. 如果被恶意模拟百度爬虫大量循环爬取，会造成服务器负载方面问题，解决方法是判断访问的IP，是否是百度官方爬虫的IP。

🍊 总结：根据显示情况进行选择适合自己的项目方式，建议如下：

1. 如果构建大型网站，如商城类，别犹豫，直接上 SSR 服务器渲染，当然也有相应的坑等你，社区较成熟，英文好点，一切问题都迎刃而解。
2. 如果只是个人博客、公司官网这类，其余三种都可以。
3. 如果对己用 SPA 开发完成的项目进行 SEO 优化，而且支持 node 服务器，请使用 Phantomjs。

## Vue项目的优化

🍊 代码层面的优化

- v-if 和 v-show 区分使用场景
- computed 和 watch 区分使用场景
- v-for 遍历必须为 item 添加 key，且避免同时使用 v-if
- 长列表性能优化
- 事件的销毁
- 图片资源懒加载
- 路由懒加载
- 第三方插件的按需引入
- 优化无限列表性能
- 服务端渲染 SSR or 预渲染

🍊 Webpack 层面的优化

- Webpack 对图片进行压缩
- 减少 ES6 转为 ES5 的冗余代码
- 提取公共代码
- 模板预编译
- 提取组件的 CSS
- 优化 SourceMap
- 构建结果输出分析
- Vue 项目的编译优化

🍊 基础的 Web 技术的优化

- 开启 gzip 压缩
- 浏览器缓存
- CDN 的使用
- 使用 Chrome Performance 查找性能瓶颈

## vue首屏优化

1. 其实还是前端性能优化的步骤，通过fp fcp fmp的优化来提高vue首屏的优化。
2. 提取第三方库，缓存，减少打包体积
3. 固定module id，为了缓存
4. 路由懒加载
5. 开启gzip
6. 图片懒加载
7. 压缩加密合并
8. tree shaking 、scope hositing、  code spliting
9. babel 按需引入pollyfill

## Vue2v VS Vue3响应式的升级

通过`Object.defineProperty`来实现响应式有何**缺点**？

1. 当观察的数据嵌套非常深时，这样是非常耗费性能的。
2. 只对初始对象里的属性有劫持，当此对象**新增某个属性**或者**移除某属性**时，都是无响应式。故可通过`Vue.set()`或`Vue.delete()`解决此类问题。
3. **无法**监听数组索引的直接赋值，**无法**监听修改数组的长度，故Vue2中通过修改数组的继承关系，重写数组方法的方式进行拦截调用。例如这些数组的方法`push`,`pop`,`shift`,`unshift`,`splice`,`sort`,`reverse`。

Vue3使用`Proxy`代理实现响应式的**优势**：

1. 可以劫持**整个对象**（而不是仅对属性劫持），并返回一个新对象。`Proxy`在代码量上远远优于`Object.defineProperty()`的数据劫持操作。
2. `Proxy`提供了13种劫持捕捉操作，可以更加精细化劫持捕捉操作，这是`Object.defineProperty`无法做到的。
3. 从对对象的`重写`，升级到`拦截`，解决了新增`key`的的情况，依然没解决数组的问题、多重嵌套，处理不了监听。

## Vue 3 的升级

🍊 重写了多种机制

主要是基于：

1. 主流浏览器对新的 JavaScript 语言特性的营遍支持。
2. 当前Vue代码库随着时间的推移而暴露出来的设计和体系架构问题。

🍊 Vue 3 较2 做了很多优化

1. 重写VDOM 机制：通过编译时的标记优化运行时的速度。
2. 优化插植(slot）生成：原来的实现，父组件重渲染时子组件也必须同时重渲染，而在3 中子组件提取函数，可以分别渲染。
3. 静态树提升：没有响应式绑定的部分被提取出来作为常量，用到的时候不用再次执行它的渲染函数。
4. 静态属性提升：没有响应式绑定的组件属性(props)被提取出来作为常量，用到的时候不用再进行创建。
5. 项目结构优化：内部解耦，更好维护，支持了细粒度的 tree-shaking 如可选的生命周期

🍊  Object.defineProperty与Proxy

在 Vue2 中，`Object.defineProperty `会改变原始数据，而 Proxy 是创建对象的虚拟表示，并提供 set、get和 `deleteProperty` 等处理器，这些处理器可在访问或修改原始对象上的属性时进行拦截，有以下特点：
不需用使用` Vue.$set` 或 `Vue.$delete `触发响应式。

1. 全方位的数组变化检测，消除了 Vue2 无效的边界情况。
2. 支持 Map， Set，WeakMap 和 WeakSet。

Proxy 实现的响应式原理与 Vue2 的实现原理相同，实现方式大同小异：

* get 收集依赖
* set、 delete 等触发依赖
* 对于集合类型，就是对集合对象的方法做一层包装：原方法执行后执行依赖相关的收集或触发逻辑。

🍊 Performance优化

1. 重构了虚拟 DOM，保持兼容性，使 dom 脱离模板渲染，提升性能
2. 优化了模板编译过程，增加 patchFlag，遍历节点的时候，会跳过静态节点
3. 高效的组件初始化
4. 组件 upload 的过程性能提升 1.3~2倍
5. SSR 速度提升 2~3倍

🍊 项目架构

Vue3使用了monorepo架构， 实现了API esmodule的到处方式，CompotionsAPI的按需引用

🍊 编译方式

- Vue2 时使用的是正则匹配模板的方式，因为正则匹配的贪婪匹配导致不断的进行回溯处理，造成了性能的问题
  - 贪婪匹配
  - - 非贪婪匹配
- Vue3使用了状态机的方式， 也就是AST

🍊 with的问题

- 因为Vue2分析不了模板字符串`{{}}`中的this指向问题，所以在编译时之间照搬过去了
- Vue3时的离线编译，使用了js编译器分析了js，就不需要在使用with，但是在线编译时还在用

🍊 提供了tree shaking

打包的时候自动去除没用到的 vue 模块

🍊  更好的 ts 支持

1. 类型定义提示
2. tsx 支持
3. class 组件的支持

🍊 全家桶修改

vite 的使用，放弃原来vue2.x使用的 webpack

1. 开发服务器启动后不需要进行打包操作

2. 可以自定义开发服务器：const {createSever} = require( vite'）
3. 热模块替换的性能和模块数量无关，替换变快，即时热模块替换
4. 生产环境和 rollup 捆绑

## Vue3 如何实现DOMDIFF和VDOM的优化

🍊 编译模板的静态标记

```js
<div id="app">
    <p>周一呢</p>
    <p>明天就周二了</p>
    <div>{{week}}</div>
</div>
```

在Vue2会被解析成一下代码

```js
function render() {
  with(this) {
    return _c('div', {
      attrs: {
        "id": "app"
      }
    }, [_c('p', [_v("周一呢")]), _c('p', [_v("明天就周二了")]), _c('div', [_v(
      _s(week))])])
  }
}
```

可以看出，两个`p` 标签是完全静态的，以至于在后续的渲染中，其实没有任何变化的，但是在 `vue2.x `中依然会使用`_c`新建成一个`vdom`，在 `diff` 的时候仍然需要去比较，这样就造成了一定量的性能消耗。
在vue3中

```js
import { createVNode as _createVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createBlock as _createBlock } from "vue"

export function render(_ctx, _cache) {
  return (_openBlock(), _createBlock("div", { id: "app" }, [
    _createVNode("p", null, "周一呢"),
    _createVNode("p", null, "明天就周二了"),
    _createVNode("div", null, _toDisplayString(_ctx.week), 1 /* TEXT */)
  ]))
}
```

只有当` _createvNode `的第四个参数不为空的时候，这时，才会被遍历，而静态节点就不会被遍历到

同时发现了在` vue3`最后一个非静态的节点编译后：出现了`/*TEXT*/`，这是为了标记当前内容的类型以便进行 `diff`，如果不同的标记，只需要去比较对比相同的类型。这就不会去浪费时间对其他类型进行遍历了

```js
export const enum PatchFlags {
  TEXT = 1,// 表示具有动态textContent的元素
  CLASS = 1 << 1,  // 表示有动态Class的元素
  STYLE = 1 << 2,  // 表示动态样式（静态如style="color: red"，也会提升至动态）
  PROPS = 1 << 3,  // 表示具有非类/样式动态道具的元素。
  FULL_PROPS = 1 << 4,  // 表示带有动态键的道具的元素，与上面三种相斥
  HYDRATE_EVENTS = 1 << 5,  // 表示带有事件监听器的元素
  STABLE_FRAGMENT = 1 << 6,   // 表示其子顺序不变的片段（没懂）。 
  KEYED_FRAGMENT = 1 << 7, // 表示带有键控或部分键控子元素的片段。
  UNKEYED_FRAGMENT = 1 << 8, // 表示带有无key绑定的片段
  NEED_PATCH = 1 << 9,   // 表示只需要非属性补丁的元素，例如ref或hooks
  DYNAMIC_SLOTS = 1 << 10,  // 表示具有动态插槽的元素
}
```

如果存在两种类型，那么只需要对这两个值对应的 patchflag 进行位晕眩
如：`TEXT` 和` PROPS`

```js
TEXT: 1 ,PROPRS: 1<<3 => 8

// 那么对1和8进行按位与运算得到=>9
```

🍊 事件储存

> 绑定的事件会缓存在缓存中

```js
<div id="app">
  <button @click="handleClick">周五啦</button>
</div>
```

经过转换

```js
import { createVNode as _createVNode, openBlock as _openBlock, createBlock as _createBlock } from "vue"

export function render(_ctx, _cache) {
  return (_openBlock(), _createBlock("div", { id: "app" }, [
    _createVNode("button", {
      onClick: _cache[1] || (_cache[1] = ($event, ...args) => (_ctx.handleClick($event, ...args)))
    }, "周五啦")
  ]))
}
```

在代码中可以看出在绑定点击事件的时候，会生成并缓存了一个内联函数在`cache`中，变成了一个静态的节点

🍊 静态提升

```js
<div id="app">
    <p>周一了</p>
    <p>周二了</p>
    <div>{{week}}</div>
    <div :class="{red:isRed}">周三呢</div>
</div>
```

转换成

```js
import { createVNode as _createVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createBlock as _createBlock } from "vue"

const _hoisted_1 = { id: "app" }
const _hoisted_2 = /*#__PURE__*/_createVNode("p", null, "周一了", -1 /* HOISTED */)
const _hoisted_3 = /*#__PURE__*/_createVNode("p", null, "周二了", -1 /* HOISTED */)

export function render(_ctx, _cache) {
  return (_openBlock(), _createBlock("div", _hoisted_1, [
    _hoisted_2,
    _hoisted_3,
    _createVNode("div", null, _toDisplayString(_ctx.week), 1 /* TEXT */),
    _createVNode("div", {
      class: {red:_ctx.isRed}
    }, "周三呢", 2 /* CLASS */)
  ]))
}
```

在这里可以看出来将一些静态的节点放放在了 render 函数的外部，这样就避免了每次 render 都会去生成一次静态节点。

## Vue3 hooks

`Vue Hook`就是一些vue提供的内置函数，这些函数可以让`Function Component`和`Class Component`一样能够拥有组件状态 `(state）`以及进行副作用`(side effect)`

🍊 为什么要用vue-hooks？

首先从`class-component/vue-options`说起：

1. 跨组件代码难以复用
2. 大组件，维护困难，颗粒度不好控制，细粒度划分时，组件嵌套存层次太深-影响性能
3. 类组件，this不可控，逻辑分散，不容易理解
4. `mixins`具有副作用，逻辑互相嵌套，数据来源不明，且不能互相消费

当一个模版依赖了很多`mixin`的时候，很容易出现数据来源不清或者命名冲突的问题，而且开发`mixins`的时候，逻辑及逻辑依赖的属性互相分散且`mixin`之间不可互相消费。这些都是开发中令人非常痛苦的点，因此，`vue3.0`中引入hooks相关的特性非常明智。

## 常用 Hooks 介绍

### 3.1 `withHooks`

`hooks` 是在传递给`withHooks`的函数中调用的

```js
const Foo = withHooks(h => {
  // state
  const [count, setCount] = useState(0)

  // effect
  useEffect(() => {
    document.title = "count is " + count
  })

  return h("div", [
    h("span", `count is: ${count}`),
    h(
      "button",
      {
        on: {
          click: () => setCount(count + 1)
        }
      },
      "+"
    ),
  ])
})
```

`withHooks`是一个高阶函数，传入一个函数，这个函数内部返回一个`vnode`，`withHooks `方法返回的是一个`vue`的选项对象。

```js
Foo = {
  created() {},
  data() {},
  render () {}
};
```

这个选项对象可以直接调用`Vue.component` 方法生成全局组件，或者在`render` 方法中生成`vnode`

```js
Vue.component('v-foo', Foo);
// or
render(h) {
    return h("div", [h(Foo), h(Foo)])
}
```

### 3.2 `useState`

`useState`理解起来非常简单，和`Class Component`的`vuex` 中`state`一样，都是用来管理组件状态的。因为`Function Component`每次执行的时候都会生成新的函数作用域所以同一个组件的不同渲染`(render）`之间是不能够共用状态的，因此开发者一旦需要在组件中引入状态就需要将原来的`Function Component`改成`Class Component`，这使得开发者的体验十分不好。`useState`就是用来解决这个问题的，它允许`Function Component`将自己的状态持久化到vue运行时`(runtime)`的某个地方` (memory cell)`，这样在组件每次重新渲染的时候都可以从这个地方拿到该状态，而且当该状态被更新的时候，组件也会重渲染。

```js
//声明
const [count, setcount] = useState(0)
const [state, setState] = useState({
    status: 'pending',
    data: null,
    error: null
})
const handleTextChange(value) => {
	setText({
		status: 'changed',
	    data: value,
	    error: null
	})
}
//引用
<div>{count}</div>
< ... onClick= setcount(count + 1) ... >
<div>{state}</div>
onChange=handleTextChange(count)
```

`useState`接收一个`initial`变量作为状态的初始值，返回值是一个数组。返回数组的第一个元素代表当前`state`的最新值，第二个元素是一个用来更新state的函数。这里要注意的是`state`和`setState`这两个变量的命名不是固定的，应该根据你业务的实际情况选择不同的名字，可以是`setA`和`setB`，也可以是`setC`和`setD`这类的命名。需要注意的是`setState `这个是全量替代。
我们在实际开发中，一个组件可能不止一个`state`，如果组件有多个`state`，则可以在组件内部多次调用`useState`，这些使用类似`Vuex`里面的`state`使用。

### 3.3 `useEffect`

`useEffect `用于添加组件状态更新后，需要执行的副作用逻辑。
`useEffect `指定的副作用逻辑，会在组件挂载后执行一次、在每次组件渲染后根据指定的依赖有选择地执行、并在组件卸载时执行清理逻辑(如果指定了的话)。

```js
import { withHooks, useState, useEffect } from "vue-hooks"

const Foo = withHooks(h => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    document.title = "count is " + count
  })
  return h("div", [
    h("span", `count is: ${count}`),
    h("button", { on: { click: () => setCount(count + 1) } }, "+" )
  ])
})
```

代码中，通过 `useEffect `使每当 `count `的状态值变化时，都会重置 `document.title`。
**注意：**这里没有指定` uSeEffect `的第二个参數` deps`，表示只要组件重新渲染都会执行` useEffect` 指定的逻辑，不限制必须是 `count `变化时。

### 3.4 `useRef`

`useRef`是用来在组件不同渲染之间共用一些数据的，它的作用和我们在`Vue Class Component`里面为`$refs.xxx` 赋值是一样的。那么它的一些特性就跟`refs`是类似：

1. 组件更新之后，可以获取最新的状态、值
2. 值不需要响应式处理
3. 独立于其他作用域之外，不污染其他作用域
4. `useRef`返回的是对象

```js
const [count, setcount] = useState(0)
const num = useRef(count)
const addCount = () => {
let sum = count ++ 
setcount(sum)
num.current = sum
console.log(count,num.current)
}
//得到的结果是
0 1
1 2
2 3
...
```

### 3.5 `useData`

`useData` 我们可以理解为`Vue class Function `里面的 `$data`,也可以认为与` useState` 类似，不同的是，`useData `不提供更新器。只是作为数据变量的声明、修改、调用。

```js
//声明
const data = useData({
    count: 0
})
//调用
console.log(data.count)
```

### 3.6 `useMounted`

`useMounted`需要在` mounted `事件中执行的逻辑。

```js
useMounted(() => {
    console.log('mounted!')
})
```

3.7 `use Destroyed`

`useDestroyed`需要在` destroyed `事件中执行的逻辑。

```js
useDestroyed((） =>{
	console.log (' destroyed!")
})
```

### 3.8 `custom hooks`

```js
// a custom hook that sync with window width
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  const handleResize = () => {
    setWidth(window.innerWidth)
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])
  return width
}

// custom hook
const width = useWindowWidth()
```

如果把`useState`和`useEffect`用单独的函数抽离出来，当作通用的方法，其实就是`custom hooks`、本质就是复用代码的逻辑而已。

## vue-router原理

vue-router的原理就是更新视图而不重新请求页面。vue-router可以通过mode参数设置为三种模式：**hash模式、history模式**、abstract模式。

* **hash模式**：hash值等于url中#及其以后的内容。浏览器是根据hash值的变化，将页面加载到相应的DOM位置。锚点变化只是浏览器的行为，每次锚点变化后依然会在浏览器中留下一条历史记录，可以通过浏览器的后退按钮回到上一个位置。

* **History模式**：它是利用H5 History API来实现的。通过history.pushState方法来实现URL的跳转而无需重新加载页面。但是它的问题在于当刷新页面的时候会走后端路由，所以需要服务端的辅助来兜底，避免URL无法匹配到资源时能返回页面。

* **abstract模式**： 服务端下使用。使用一个不依赖于浏览器的浏览历史虚拟管理后台。

hash模式和history模式都是通过`window.addEventListenter()`方法监听`hashchange`和`popState`进行相应路由的操作。可以通过back、foward、go等方法访问浏览器的历史记录栈，进行各种跳转。而abstract模式是自己维护一个模拟的浏览器历史记录栈的数组。

**param和query的区别：** 

* query传递的参数会通过问号以键值对的方式显示在url内。param不会。
* params是必传的，如果没有参数会导致跳转失败或者页面会没有内容。query则不会影响页面显示

🍊 路由守卫：

* router.beforeEach(to,from,next) 全局前置守卫
* router.afterEach(to,from) 全局后置守卫

#### 路由懒加载原理: 

结合vue的异步组件和webpack的代码分割实现的，原理就是通过promise来加载路由，利用了js的异步事件队列。

**注意：**在结合node层使用history模式时，可以使用connect-history-api-fallback中间件，避免url不匹配时出现404.

koa2-connect-history-api-fallback中间件设置白名单，保证后端路由或api的正常访问。