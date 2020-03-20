/* @flow */
/**
 * isRegExp 验证是否为正则表达式 
 * remove  数组删除元素
 * getFirstComponentChild 获取第一个子组件
 */
import { isRegExp, remove } from 'shared/util'
import { getFirstComponentChild } from 'core/vdom/helpers/index'

type VNodeCache = { [key: string]: ?VNode };

// 获取组件 name 或者 tag
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
