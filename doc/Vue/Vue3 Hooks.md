# Vue3 hooks

## 一、什么是 Hooks？

hooks 字面意思就是钩子函数，那么什么是钩子函数呢？
**钩子函数：** 钩子函数是在一个事件触发的时候，在系统级捕获到了他，然后做一些操作。一段用以处理系统消息的程序。“钩子”就是在某个阶段给你一个做某些处理的机会。直白的说法：类似回调函数
钩子函数：

* 一个函数/方法，在系统消息触发时被系统调用，例如click等事件调用
* 不是用户自己触发的，例如订阅者发布者模式的实现

钩子函数的名称是确定的，当系统消息触发，自动会调用。

1. 例如Vue的watch()函数，用户只需要编写watch()的函数体里面的函数，当页面元素发生变化的时候，系统就会先调用watch()。
2. 例如`react`的`componentwilUpdate`函数，用户只需要编写`componentWillUpdate`的函数体，当组件状态改变要更新时，系统就会调用`componentwilUpdate`。

`Vue Hook`就是一些vue提供的内置函数，这些函数可以让`Function Component`和`Class Component`一样能够拥有组件状态 `(state）`以及进行副作用`(side effect)`

## 二、为什么要用vue-hooks？

首先从`class-component/vue-options`说起：

1. 跨组件代码难以复用
2. 大组件，维护困难，颗粒度不好控制，细粒度划分时，组件嵌套存层次太深-影响性能
3. 类组件，this不可控，逻辑分散，不容易理解
4. `mixins`具有副作用，逻辑互相嵌套，数据来源不明，且不能互相消费

当一个模版依赖了很多`mixin`的时候，很容易出现数据来源不清或者命名冲突的问题，而且开发`mixins`的时候，逻辑及逻辑依赖的属性互相分散且`mixin`之间不可互相消费。这些都是开发中令人非常痛苦的点，因此，`vue3.0`中引入hooks相关的特性非常明智。

## 三、常用 Hooks 介绍

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

### 3.7 `use Destroyed`

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

