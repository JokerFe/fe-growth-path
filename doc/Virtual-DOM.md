# Virtual DOM

> React和Vue都通过使用Virtual Dom技术结合各自的DOM DIFF算法来**提高页面的渲染效率**。

## 什么是Virtual Dom？

从本质上来说，Virtual Dom是一个JS对象，通过对象的方式来表示DOM结构。将页面的状态抽象为JS对象的形式，配合不同的渲染工具，使跨平台渲染成为可能。通过事务处理机制，将多次DOM修改的结果一次性的更新到页面上，从而**有效的减少页面渲染的次数，减少修改DOM的重绘重排次数，提高渲染性能**。

本文主要研究Vue的Virtual Dom的实现。

> VNode对象定义路径：src/core/vdom/vnode.js

具体代码太多，这里不做全部全部展示，只是介绍几个核心的属性：

* `tag` ：当前`vnode`的标签属性

* `data` ：包含了最后渲染成真实`dom`节点后，节点上的`class`，`attribute`，`style`以及绑定的事件

* `children` ：包含当前`vnode`的所有子节点

* `text` ：文本属性

* `elm` 为这个`vnode`对应的真实`dom`节点

* `key` ：`vnode`的标记，在`diff`过程中可以提高`diff`的效率

## 创建流程

从Vue实例的创建到Vnode的整个过程。

#### 1. 初始化Vue

我们平时通过`New Vue()`方法创建vm实例时，其实调用的就是如下代码：

> 源码路径：src/core/instance/index.js

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

进行调用方式限制，之后调用`this._init(options)`方法进行初始化。

> 源码路径：src/core/instance/init.js

```js
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // 合并配置
    if (options && options._isComponent) {
      // optimize internal component instantiation since dynamic options merging is pretty slow, and none of the internal component options needs special treatment.
      // 优化内部组件实例化，因为动态选项合并非常慢，并且没有任何内部组件选项需要特殊处理。
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)  // 初始化生命周期钩子
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate') // 调用beforeCreate钩子  
    initInjections(vm) // 初始化inject数据
    initState(vm)    // 初始化 vm实例上data/props/method/watch等属性
    initProvide(vm) // 初始化provide
    callHook(vm, 'created')// 调用created钩子  

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```

通过`vm.$mount(vm.$options.el)`方法进行实例的挂载。

#### 2. 实例挂载

> 源码路径：src/platforms/web/entry-runtime-with-compiler.js

```js
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}
```

`$mount`方法是挂载在Vue原型上的方法

> 源码路径：src/platforms/web/runtime/index.js

```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

> 源码路径：src/core/instance/lifecycle.js

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el

  //  如果不存在render 则创建一个空的虚拟dom
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  // 调用beforeMount 钩子函数
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      // 生成虚拟 vnode   
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      // 更新Dom
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // we set this to vm._watcher inside the watcher's constructor since the watcher's initial patch may call $forceUpdate 
  //  (e.g. inside child component's mounted hook), which relies on vm._watcher being already defined
  //  实例化一个渲染Watcher，在它的回调函数中会调用 updateComponent 方法  
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

由代码可以看出，核心就是创建一个Watcher实例，通过它的回调函数调用`updateComponent`，也就是上面创建的方法，内部调用`vm._render()`生成虚拟DOM，调用`vm._update(vnode, hydrating)`更新DOM。

#### 3. 创建虚拟 Node

上面代码中`mountComponent`函数内部通过`Watcher`的回调函数`updateComponent`来调用vm实例的私有方法`_render()`生成虚拟DOM。

> 源码路径：src/core/instance/render.js

```js
export function renderMixin (Vue: Class<Component>) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype)
  // 此处将nextTick挂载到Vue原型上	
  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this)
  }
  // Vue原型上私有的渲染函数
  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      )
    }

    // set parent vnode. this allows render functions to have access to the data on the placeholder node.
    // 设置父节点，它允许渲染函数有权限去访问data上的占位节点
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      /** There's no need to maintain a stack because all render fns are called separately from one another. 
       * 因为渲染函数是独自调用的，所以不需要维护一个堆栈
       * Nested component's render fns are called when parent component is patched.
       * 当父组件进行patch时，嵌套组件的渲染函数才会被调用
       */ 
      currentRenderingInstance = vm
       // 调用 createElement 方法来返回 vnode
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
        } catch (e) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    } finally {
      currentRenderingInstance = null
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    // return empty vnode in case the render function errored out
    // 当渲染函数出错时没返回一个空的vnode
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
}
```

上述代码主要过程为：`vnode = render.call(vm._renderProxy, vm.$createElement)`。调用实例上`createElement`函数进行虚拟Dom的创建。

> 源码路径：src/core/vdom/create-element.js

```js
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}
// 私有的创建函数
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      "Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n" +
      'Always create fresh vnode data objects in each render!',
      context
    )
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    if (!__WEEX__ || !('@binding' in data.key)) {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      )
    }
  }
  // support single function children as default scoped slot
  // 支持单功能组件作为默认作用域插槽
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  // 判断render 函数的生成方式
  if (normalizationType === ALWAYS_NORMALIZE) {
    // 不是编译生成
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    // 编译生成
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if (process.env.NODE_ENV !== 'production' && isDef(data) && isDef(data.nativeOn)) {
        warn(
          `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`,
          context
        )
      }
      // 创建vnode
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}

```

共接收5个参数：

* `context` 表示 VNode 的上下文环境，它是 `Component` 类型
* `tag`表示标签，它可以是一个字符串，也可以是一个 `Component`；
* `data` 表示 VNode 的数据，它是一个 `VNodeData` 类型，可以在 `flow/vnode.js` 中找到它的定义；
* `children` 表示当前 VNode 的子节点，它是任意类型的，需要被规范为标准的 `VNode` 数组；
* `normalizationType`：表示调用环境

####  总结

Vue创建Vnode的流程为：

1. 在Vue构造函数中调用内部的`_init`方法
2. `_init`内部根据参数的el元素调用 `$mount` 实例方法去挂载 `dom` 
3.  `$mount` 实例方法实际上继续调用`mountComponent`方法
4. `mountComponent`方法内部实例化一个渲染Watcher，在它的回调函数中会调用 `updateComponent` 方法 
5. `updateComponent`内调用 `vm._render` 方法先生成虚拟 Node，最终调用 `vm._update` 更新 `DOM`
6.  `vm._render` 调用 `createElement` 方法来生成 vnode
7. `createElement`通过上下文环境、标签名、数据、子组件等参数来创建Vnode

