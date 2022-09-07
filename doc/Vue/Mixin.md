# 混入（Mixin）

>  混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

## 使用

```js
var mixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('from mixin')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('bar')
    },
    conflicting: function () {
      console.log('from self')
    }
  }
})

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "from self"
```

混入可将**钩子函数、`methods`、`components`、`directives`等**合并为一个对象。钩子函数同名时，混入对象的钩子将在组件自身钩子**之前**调用。**对象键名冲突时，取组件的键值对**。

## Mixin的合并策略

### Vue.mixin源码

```js
import { mergeOptions } from '../util/index'

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```

源码中主要是通过`mergeOptions`方法将`options`和`mixin`进行了合并。

### mergeOptions方法的实现

```js
// /src/core/util/options.js
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  ...
    
  // 规范化属性  
  normalizeProps(child, vm)
  normalizeInject(child, vm)
  normalizeDirectives(child)

  // 此处注释掉了一些需要递归判断mixin中存在mixin的情况
  ...


  const options = {}
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
```

源码主要进行了两个主要操作：

1. 递归处理mixin
2. 遍历parent中的key，在调用mergeField进行合并，具体的合并策略在starts中

```js
// src/core/util/options.js(依然会省略此处不关心的代码)
import config from '../config'
const strats = config.optionMergeStrategies

// 合并data
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
    // 暂不考虑是如何合并的
    ...
}

// 合并watch
strats.watch = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {

// 暂不考虑是如何合并的
 ...
}
```

具体不同的合并方式查看源码路径：

> /src/core/util/options.ts

当不同选项的命名发生冲突时的合并策略：

1. data： mixins中的data会合并到实例中的data中，有冲突的话，实例中data的数据会覆盖mixins中的数据
2. 生命周期钩子函数：都会执行，先执行mixins中的钩子函数
3. methods、components、directives：实例中的会覆盖mixins中的

## 自定义合并策略

自定义选项在合并时，默认策略为简单地覆盖已有值。如果想让某个自定义选项以自定义逻辑进行合并，可以在 `Vue.config.optionMergeStrategies` 中添加一个函数：

```javascript
Vue.config.optionMergeStrategies.customOption = (toVal, fromVal) => {
  // return mergedVal
}
```

合并策略接收在父实例和子实例上定义的该选项的值，分别作为第一个和第二个参数。

```javascript
Vue.config.optionMergeStrategies.myMixin = function (toVal, fromVal) {
    console.log(toVal, fromVal);
    // => undefined "parent"
    // => parent reportList
    return fromVal || toVal;
};
const myMixin = {
    myMixin: 'parent'
};
export default {
    myMixin: 'reportList',
    mixins: [myMixin],
    created(){
        console.log(this.$options.myMixin);
        // => reportList
    }
}
```

虽然可以自定义合并策略，但是建议不要使用Vue中已有的options（例如data，props，watch，methods等）来合并，这样会冲突掉原来的逻辑，慎用的好！！！

