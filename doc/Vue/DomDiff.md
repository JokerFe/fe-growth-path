# DomDiff

> React和Vue都通过使用Virtual Dom技术结合各自的DOM DIFF算法来**提高页面的渲染效率**。

## DomDiff触发

在[Virtual DOM](https://github.com/Jokul518/fe-growth-path/blob/master/doc/Virtual-DOM.md)篇`updateComponent`函数中调用两个函数，调用`vm._render()`生成虚拟DOM，调用`vm._update(vnode, hydrating)`更新DOM。Vue就是通过`_update`方法来触发Dom Diff的`__patch__`的。

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }
```

