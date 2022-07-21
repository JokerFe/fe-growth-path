## Vue2 VS Vue3

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



## 响应式API

### Reactive

```js
function makeReactive(target: any, shallow: boolean) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (!isReadonly(target)) {
    const ob = observe(
      target,
      shallow,
      isServerRendering() /* ssr mock reactivity */
    )
  }
}
```

