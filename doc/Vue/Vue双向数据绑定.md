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

在[Virtual-DOM]()