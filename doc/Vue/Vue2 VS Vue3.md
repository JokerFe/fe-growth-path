diff算法的优化；hoistStatic 静态提升；cacheHandlers 事件侦听器缓存；ssr渲染；更好的Ts支持；Compostion API: 组合API/注入API；更先进的组件；自定义渲染API；按需编译，体积比vue2.x更小；支持多根节点组件等。

# Vue2v VS Vue3

#### 通过`Object.defineProperty`来实现响应式有何**缺点**？

1. 当观察的数据嵌套非常深时，这样是非常耗费性能的。
2. 只对初始对象里的属性有劫持，当此对象**新增某个属性**或者**移除某属性**时，都是无响应式。故可通过`Vue.set()`或`Vue.delete()`解决此类问题。
3. **无法**监听数组索引的直接赋值，**无法**监听修改数组的长度，故Vue2中通过修改数组的继承关系，重写数组方法的方式进行拦截调用。例如这些数组的方法`push`,`pop`,`shift`,`unshift`,`splice`,`sort`,`reverse`。

Vue3使用`Proxy`代理实现响应式的**优势**：

1. 可以劫持**整个对象**（而不是仅对属性劫持），并返回一个新对象。`Proxy`在代码量上远远优于`Object.defineProperty()`的数据劫持操作。
2. `Proxy`提供了13种劫持捕捉操作，可以更加精细化劫持捕捉操作，这是`Object.defineProperty`无法做到的。
3. 从对对象的`重写`，升级到`拦截`，解决了新增`key`的的情况，依然没解决数组的问题、多重嵌套，处理不了监听。

## 概念

### Proxy

在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

```js
var proxy = new Proxy(target, handler);
```

#### Proxy支持的拦截操作：

- **get(target, propKey, receiver)**：拦截对象属性的读取，比如`proxy.foo`和`proxy['foo']`。
- **set(target, propKey, value, receiver)**：拦截对象属性的设置，比如`proxy.foo = v`或`proxy['foo'] = v`，返回一个布尔值。
- **has(target, propKey)**：拦截`propKey in proxy`的操作，返回一个布尔值。
- **deleteProperty(target, propKey)**：拦截`delete proxy[propKey]`的操作，返回一个布尔值。
- **ownKeys(target)**：拦截`Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in`循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。
- **getOwnPropertyDescriptor(target, propKey)**：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。
- **defineProperty(target, propKey, propDesc)**：拦截`Object.defineProperty(proxy, propKey, propDesc）`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。
- **preventExtensions(target)**：拦截`Object.preventExtensions(proxy)`，返回一个布尔值。
- **getPrototypeOf(target)**：拦截`Object.getPrototypeOf(proxy)`，返回一个对象。
- **isExtensible(target)**：拦截`Object.isExtensible(proxy)`，返回一个布尔值。
- **setPrototypeOf(target, proto)**：拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- **apply(target, object, args)**：拦截 Proxy 实例作为函数调用的操作，比如`proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`。
- **construct(target, args)**：拦截 Proxy 实例作为构造函数调用的操作，比如`new proxy(...args)`。

#### 💥 好处

1. 代理成为了代码交互的主要对象，而实际目标对象保持隐藏/被保护的状态。
2. 可以拦截（并覆盖）对象的几乎所有行为，这意味着可以以强有力的方式扩展对象特性超出JavaScript内容。
3. 降低函数或类的复杂度

### Reflect

`Reflect`称为**反射**。它也是ES6中为了操作对象而提供的新的API，用来替代直接调用`Object`的方法。`Reflect`是一个内置的对象，它提供拦截 JavaScript 操作的方法。

#### 设计目的

1. 将`Object`对象的一些明显属于语言内部的方法（比如`Object.defineProperty`），放到`Reflect`对象上。现阶段，某些方法同时在`Object`和`Reflect`对象上部署，未来的新方法将只部署在`Reflect`对象上。也就是说，从`Reflect`对象上可以拿到语言内部的方法。
2. 修改某些`Object`方法的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回`false`。
3. 让`Object`操作都变成函数行为。某些`Object`操作是命令式，比如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为
4. `Reflect`使用在`Proxy`中的转发对象上也十分典型。**对于每个可被 `Proxy` 捕获的内部方法，在 `Reflect` 中都有一个对应的方法，其名称和参数与 `Proxy` 捕捉器相同。** 这一点很关键，13种捕获器可以与`Reflect`方法一一对应，简化 `Proxy` 的创建。**这也是`Reflect` 的出现的原因之一：完美的与`Proxy`搭配使用。** 

```js
let p = new Proxy(target, {
  get (target, prop, receiver) {
    // proxy的get捕获器和Reflect.get方法名和参数一一对应
    return Reflect.get(target, prop, receiver);
    // 因为两者参数一直故可以简写为 Reflect.get(...arguments) 
  }
});
```

### `Proxy` + `Reflect`

1. 只要是`Proxy`对象具有的代理方法，`Reflect`对象全部都与之对应。故无论`Proxy`怎么修改默认行为，总是可以通过`Reflect`对应的方法获取默认行为。

2. 使用`Reflect` API修改行为不会报错，使用起来更为合理。例如上面所提到的`Object.defineProperty(obj, name, desc)`和`Reflect.defineProperty(obj, name, desc)`。

3. `Reflect`提供这种静态方法调用，更加的具有语义化。

### 总结

1. `Object.defineProperty` 只能劫持对象的属性，而 `Proxy `是直接代理对象,由于 `Object.defineProperty `只能对属性进行劫持，需要遍历对象的每个属性。而 Proxy 可以直接代理对象。

2. `Object.defineProperty `对新增属性需要手动进行` Observe`，由于` Object.defineProperty `劫持的是对象的属性，所以新增属性时，需要重新遍历对象，对其新增属性再使用 `ObjectdefineProperty `进行劫持。也正是因为这个原因，使用 Vue 给 data 中的数组或对象新增属性时，需要使用 vm.$set 才能保证新增的属性也是响应式的。
3. Proxy 支持13 种拦截操作，这是` defineProperty `所不具有的新标准性能红利
4. Proxy 作为新标准，长远来看，JS 引擎会继续优化 Proxy，但` getter `和` setter `基本不会
5. Proxy 兼容性差 目前并没有一个完整支持` Proxy `所有拦截方法的` Polyfill `方案

## Vue 3 的升级

#### 重写了多种机制

主要是基于：

1. 主流浏览器对新的 JavaScript 语言特性的营遍支持。
2. 当前Vue代码库随着时间的推移而暴露出来的设计和体系架构问题。

#### Vue 3 较2 做了很多优化

1. 重写VDOM 机制：通过编译时的标记优化运行时的速度。
2. 优化插植(slot）生成：原来的实现，父组件重渲染时子组件也必须同时重渲染，而在3 中子组件提取函数，可以分别渲染。
3. 静态树提升：没有响应式绑定的部分被提取出来作为常量，用到的时候不用再次执行它的渲染函数。
4. 静态属性提升：没有响应式绑定的组件属性(props)被提取出来作为常量，用到的时候不用再进行创建。
5. 项目结构优化：内部解耦，更好维护，支持了细粒度的 tree-shaking 如可选的生命周期

#### Object.defineProperty与Proxy

在 Vue2 中，`Object.defineProperty `会改变原始数据，而 Proxy 是创建对象的虚拟表示，并提供 set、get和 `deleteProperty` 等处理器，这些处理器可在访问或修改原始对象上的属性时进行拦截，有以下特点：
不需用使用` Vue.$set` 或 `Vue.$delete `触发响应式。

1. 全方位的数组变化检测，消除了 Vue2 无效的边界情况。
2. 支持 Map， Set，WeakMap 和 WeakSet。

Proxy 实现的响应式原理与 Vue2 的实现原理相同，实现方式大同小异：

* get 收集依赖
* set、 delete 等触发依赖
* 对于集合类型，就是对集合对象的方法做一层包装：原方法执行后执行依赖相关的收集或触发逻辑。

#### Performance优化

1. 重构了虚拟 DOM，保持兼容性，使 dom 脱离模板渲染，提升性能
2. 优化了模板编译过程，增加 patchFlag，遍历节点的时候，会跳过静态节点
3. 高效的组件初始化
4. 组件 upload 的过程性能提升 1.3~2倍
5. SSR 速度提升 2~3倍

#### 项目架构

Vue3使用了monorepo架构， 实现了API esmodule的到处方式，CompotionsAPI的按需引用

#### 编译方式

- Vue2 时使用的是正则匹配模板的方式，因为正则匹配的贪婪匹配导致不断的进行回溯处理，造成了性能的问题
  - 贪婪匹配
  - - 非贪婪匹配
- Vue3使用了状态机的方式， 也就是AST

#### with的问题

- 因为Vue2分析不了模板字符串`{{}}`中的this指向问题，所以在编译时之间照搬过去了
- Vue3时的离线编译，使用了js编译器分析了js，就不需要在使用with，但是在线编译时还在用

#### 提供了tree shaking

打包的时候自动去除没用到的 vue 模块

#### 1.4 更好的 ts 支持

1. 类型定义提示
2. tsx 支持
3. class 组件的支持

#### 全家桶修改

vite 的使用，放弃原来vue2.x使用的 webpack

1. 开发服务器启动后不需要进行打包操作

2. 可以自定义开发服务器：const {createSever} = require( vite'）
3. 热模块替换的性能和模块数量无关，替换变快，即时热模块替换
4. 生产环境和 rollup 捆绑

## Vue3 如何实现DOMDIFF和VDOM的优化

### 1) 编译模板的静态标记

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

### 2）事件储存

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

### 3）静态提升

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