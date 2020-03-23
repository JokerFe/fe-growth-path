# keepalive

> keepalive是vue内置的一个组件，可以使被包含的组件**保留状态**，或者**避免重新渲染**。简单的说就是**组件缓存**。

## 基本用法

```html
<!-- 被keep-alive包裹的组件会被缓存 -->
<keep-alive include="" exclude="" max="">
  <component></component>
</keep-alive>
```

被`keepalive`包裹的组件不会被再次初始化，也就意味着不会重新走组件初始化的生命周期函数，也就是`mounted`之前的生命周期函数。keepalive是一个抽象的组件，缓存的组件不会调用`mounted`，为此提供了`activated`和`deactivated`钩子函数。

缓存的组件就会多处两个生命周期钩子函数：

* `activated`当缓存组件再次显示的时候触发
* `deactivated`当缓存组件消失的时候触发

`keepalive`组件提供了三个属性作为组件缓存的匹配规则：

* `include` 包含的组件(name或者tag)，可为字符串、数组和正则表达式
* `exclude` 不包含的组件，可为字符串、数组和正则表达式，优先级大于`include`
* `max`缓存组件的最大数量，可为字符串和数字

**注：当包裹的组件在超过最大缓存数量时被清除才会调用它的`destory`钩子函数。如果它一直在被缓存的列表中，是不会触发的。**

## 更多用法

#### 结合路由使用

#### 前进刷新后退不刷新

链接： `SunnySky `的  [《vue实现前进刷新，后退不刷新》](https://juejin.im/post/5a69894a518825733b0f12f2)

## 源码解读

>  源码路径：/src/core/components/keep-alive.js

```js
/* @flow */
/**
 * isRegExp 验证是否为正则表达式 
 * remove  数组删除元素
 * getFirstComponentChild 获取第一个子组件
 */
import { isRegExp, remove } from 'shared/util'
import { getFirstComponentChild } from 'core/vdom/helpers/index'

type VNodeCache = { [key: string]: ?VNode };

// 获取组件name 或者 tag
function getComponentName (opts: ?VNodeComponentOptions): ?string {
  return opts && (opts.Ctor.options.name || opts.tag)
}

// 检测name是否存在
function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  
  return false
}

//  修正cache数组内容
function pruneCache (keepAliveInstance: any, filter: Function) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode: ?VNode = cache[key]
    if (cachedNode) {
      const name: ?string = getComponentName(cachedNode.componentOptions)
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}

// 销毁vnode对应的组件实例
function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}

const patternTypes: Array<Function> = [String, RegExp, Array]

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

##### 方法解读

* `getComponentName`: 获取组件`name`或`tag`，首先获取`name`，用于缓存组件匹配。
* `matches`：检测`name`是否符合匹配规则，用于判断组件`name`是否符合`include`或者`exclude`规则。
* `pruneCache`：修正`cache`数组内容，遍历`cache`对象内的所有缓存组件，根据匹配规则，销毁不符合组件。
* `pruneCacheEntry`：销毁`vnode`对应的组件实例，调用的是组价实例的`$destroy()`方法进行销毁。

##### 主要逻辑

1. 判断组件`name` 不在`include`或者在`exclude`中，直接返回`vnode`，说明该组件不被缓存。
2. 获取组件实例`key`，如果有获取实例的`key`，否则重新生成。
3. key生成规则：`cid + "::"+ tag`，仅靠cid是不够的的，因为相同的构造函数可以注册为不同的本地组件。
4. 如果缓存对象内存在，则直接从缓存对象中获取组件实例给`vnode`，不存在则添加到缓存对象中。
5. 最大缓存数量：当缓存组件数量超过`max`值时，清除`keys`数组内第一个组件。
6. **缓存清除规则**：当`cache`内原有组件被使用时会将该组件`key`从`keys`数组中删除，然后`push`到`keys`数组最后，以便清除最不常用组件。

