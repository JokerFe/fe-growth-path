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





[你不知道的Virtual DOM（一）](https://segmentfault.com/a/1190000016129036)









https://segmentfault.com/a/1190000012861862

https://juejin.im/post/5a3933756fb9a045167d52b1

https://juejin.im/post/5d790255f265da03c34c284e

[https://github.com/answershuto/Blog/blob/master/blogs/%E8%81%8A%E8%81%8AVue%E7%9A%84template%E7%BC%96%E8%AF%91.MarkDown](https://github.com/answershuto/Blog/blob/master/blogs/聊聊Vue的template编译.MarkDown)

https://juejin.im/post/5d36cc575188257aea108a74#heading-9

https://www.geek-share.com/detail/2743486521.html

https://juejin.im/post/5d677e7be51d4561ce5a1c87

https://juejin.im/post/5d4faef0e51d45621479acba

http://blueskyawen.com/2019/07/16/vue-learn-in-minix/