# DomDiff

> React和Vue都通过使用Virtual Dom技术结合各自的DOM DIFF算法来**提高页面的渲染效率**。

## DomDiff触发

在[Virtual DOM](https://github.com/Jokul518/fe-growth-path/blob/master/doc/Virtual-DOM.md)篇`updateComponent`函数中调用两个函数，调用`vm._render()`生成虚拟DOM，调用`vm._update(vnode, hydrating)`更新DOM。Vue就是通过`_update`方法来触发Dom Diff的`__patch__`的。

> 源码路径：src/core/instance/lifecycle.js

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

## patch

> 源码路径：src/core/vdom/patch.js

```js
  /**
   * patch 函数
   * oldVnode 旧节点
   * vnode	新节点
   * hydrating  当旧的VNode是服务端渲染的元素，hydrating记为true
   * removeOnly 
   */
  return function patch(oldVnode, vnode, hydrating, removeOnly) {
    // isUndef  === undefined || === null
    // isDef  !== undefined || !== null

    // 如果vnode不存在直接调用destroy钩子函数
    if (isUndef(vnode)) {
      // invokeDestroyHook 递归的方式清除vnode，包括子node
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false  // 是否为初始patch
    const insertedVnodeQueue = [] // 初始化插入node队列

    // 旧VNode为空 则创建一个根节点
    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue)
    } else {
      // 标记旧VNode是否有nodeType
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        // 是同一个节点的时候直接修改现有的节点
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
      } else {
        if (isRealElement) {
          // mounting to a real element check if this is server-rendered content and if we can perform  a successful hydration.
          // 当旧的VNode是服务端渲染的元素，hydrating记为true
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          if (isTrue(hydrating)) {
            // 合并到真实dom上
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              )
            }
          }
          // either not server-rendered, or hydration failed. create an empty node and replace it
          // 如果不是服务端渲染或者合并到真实dom失败，则创建一个空的VNode替换他
          oldVnode = emptyNodeAt(oldVnode)
        }

        // replacing existing element
        // 取代现有元素
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)

        // create new node
        // 创建新节点
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          // 极罕见的边缘情况：如果旧元素处于/离开过渡状态，请不要插入。只有在组合转换+保持活动+HOCs时才会发生。
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )

        // update parent placeholder node element, recursively
        // 递归更新父占位节点元素
        if (isDef(vnode.parent)) {
          let ancestor = vnode.parent
          const patchable = isPatchable(vnode)
          while (ancestor) {
            for (let i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor)
            }
            ancestor.elm = vnode.elm
            if (patchable) {
              for (let i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, ancestor)
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              const insert = ancestor.data.hook.insert
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (let i = 1; i < insert.fns.length; i++) {
                  insert.fns[i]()
                }
              }
            } else {
              registerRef(ancestor)
            }
            ancestor = ancestor.parent
          }
        }

        // destroy old node
        // 销毁旧节点
        if (isDef(parentElm)) {
          removeVnodes([oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
```

##### 流程

1. 如果新节点不存在，则直接销毁旧节点，使用`invokeDestroyHook`函数递归清除
2. 如果旧节点为空，则说明是新增节点
3. 通过**`sameVnode`**和` isDef(oldVnode.nodeType)`判断是同一个节点，然后调用`patchNode`进行比对更新

```js
// 判断节点是否相同
function sameVnode(a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```

如果两个节点都是一样的，那么就深入比对它们的子节点。如果两个节点不一样那就说明`Vnode`完全被改变了，就可以直接替换`oldVnode`。

## patchVnode

判断节点到底是发生了什么样的改变？

```js
  function patchVnode(
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {
    // ... 省略部分代码
    // 下面比对新旧节点的子节点
    const oldCh = oldVnode.children
    const ch = vnode.children
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        // 更新子节点
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) {
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(ch)
        }
        // 设置节点类型
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        // 新增节点
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        // 删除节点
        removeVnodes(oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      // 设置节点类型
      nodeOps.setTextContent(elm, vnode.text)
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
    }
 }
```

##### 流程

1. 找到对应的真实dom，称为`el`
2. 判断`Vnode`和`oldVnode`是否指向同一个对象，如果是，那么直接`return`
3. 如果他们都有文本节点并且不相等，那么将`el`的文本节点设置为`Vnode`的文本节点。
4. 如果`oldVnode`有子节点而`Vnode`没有，则删除`el`的子节点
5. 如果`oldVnode`没有子节点而`Vnode`有，则将`Vnode`的子节点真实化之后添加到`el`
6. 如果两者都有子节点，则执行`updateChildren`函数**比较子节点** 

##  updateChildren

`updateChildren`函数为domdiff的核心，先通过源码看一下它的过程。

```js
// 更新子组件
  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0  // 旧开始下标
    let newStartIdx = 0  // 新开始下标
    let oldEndIdx = oldCh.length - 1 // 旧结束下标
    let oldStartVnode = oldCh[0]     // 旧开始节点
    let oldEndVnode = oldCh[oldEndIdx] // 旧结束节点
    let newEndIdx = newCh.length - 1 // 新结束下标
    let newStartVnode = newCh[0]     // 新开始节点
    let newEndVnode = newCh[newEndIdx]// 新结束节点
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    // RemoveOnly是仅由<transition-group>使用的特殊标志来确保在离开过渡期间删除的元素保持正确的相对位置 
    const canMove = !removeOnly

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh)
    }
    // 如果旧开始下标大于旧结束下标 或者 新开始下标大于新结束下标时(只要一个满足)，就结束比对
    // 再下面指针比对的过程中，注意指针的移动，并不是真正的开始和结束为止
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        // 如果旧开始节点不存在，旧开始节点向后移动一位，标记下标+1
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        // 如果旧结束节点不存在，旧结束节点向前移动一位，标记小标--
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 如果旧开始节点 == 新开始节点，调用patchVnode函数比对这两个节点，然后新旧开始节点后移一位，下标+1
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 如果旧结束节点 == 新结束节点 ，调用patchVnode函数比对这两个节点，然后新旧结束节点前移一位，下标-1
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        // 如果旧开始节点 == 新结束节点, 调用patchVnode函数比对这两个节点，然后将旧开始节点插入到旧结束节点下一位的前面 其实就是结束节点的后边，
        // 然后，旧开始节点后移，下标+1，新结束节点前移，下标-1
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        // 如果旧结束节点 == 新开始节点，调用patchVnode函数比对这两个节点，然后将旧结束节点插入到旧结束节点的前面
        // 然后，旧结束节点前移，下标-1，新开始节点后移，下标+1
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        // 这是最复杂的结果
        // 如果oldKeyToIdx不存在，就创建oldKeyToIdx，旧节点的key值的map，返回值为这个map
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        // 获取当前节点在旧节点中的下标， 通过key值，判断当前新开始节点是否在原有节点中存在
        // 如果存在，就从map中获取，否则就手动从旧节点中查找这个节点
        // 这里说明给v-for添加key的原因，提升了比对节点的性能
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) { // New element
          // 如果idxInOld 不存在则为新增节点
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else {
          // 如果存在，从旧节点中获取这个节点
          vnodeToMove = oldCh[idxInOld]
          // 判断获取到的这个节点和新开始节点是否是同一个节点，如果是就比较这两个节点的变化，继续diff，
          // 然后将这个节点从旧节点中 删除
          // 然后移动节点，插入 到旧开始节点的前边
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            oldCh[idxInOld] = undefined
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // same key but different element. treat as new element
            // 如果key相同，但是节点不同，依然创建新节点边插入到开始节点的前边
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        // 新节点指针后移
        newStartVnode = newCh[++newStartIdx]
      }
    }
    // 如果旧开始下标大于旧结束下标，说明旧节点比对完毕，剩下的为新增节点
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      // 如果新开始下标大于新结束下标，说明新节点比对完毕，旧节点剩下的为需要删除的节点
      removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
  }
```

##### 流程

1. 创建了四个指针，新旧`dom`的开始结束下标和`node`。
2. 先比较新旧的开始节点，如果相同则`patchVnode`这两个节点，然后指针后移 
3. 如果不相同，则比较新旧结束节点，如果相同，`patchVnode`这两个节点，然后指针前移 
4. 如果依然不同，则比较旧开始和新结束节点，如果相同，`patchVnode`这两个节点，旧开始节点后移，新结束节点前移 
5. 如果依然不同，则比较旧结束和新开始节点，如果相同，`patchVnode`这两个节点，旧结束节点前移，新开始节点后移 
6. 如果依然不同，进行最复杂的比对方式。创建旧`dom`的key值map，判断新开始节点的key是否在旧`dom`中，不存在就手动去遍历旧`dom`查找下标，如果不存在就新增，插入到旧开始指针前边。如果找到，则取出这个节点，与新开始节点比较是否为同一个节点(`sameVNode`)。相同，`patchVnode`这两个节点，在旧`dom`中删除这个节点，然后指针移动；不相同，则为新增节点。
7. 2-6方法是循环进行的，这个`while`的出口为开始结束指针的重叠。
8. 通过`patchVnode`函数可以看出来`Vue`的`DomDiff`是**深度递归遍历**的。

## DomDiff详解

通过源码知道它进行了五种情况的判断，下面通过GIF图来看一下它比对的过程。

![DomDiff](https://raw.githubusercontent.com/Jokul518/fe-growth-path/master/imgs/vue/domdiff/DomDiff-5.gif)

**第一步：**创建四个指针，分别为旧`VNode`的开始指针和结束指针、新`VNode`的开始和结束指针

**第二步：**先比较旧`VNode`的开始指针和新`VNode`的开始指针，即`A`和`E`，发现不是同一个节点

**第三步：**再比较旧`VNode`的结束指针和新`VNode`的结束指针，即`D`和`F`，依然不是相同节点

**第四步：**再比较旧`VNode`的开始指针和新`VNode`的结束指针，即`A`和`F`，不是相同节点

**第五步：**再比较旧`VNode`的结束指针和新`VNode`的开始指针，即`E`和`D`，不是相同节点

**第六步：**通过上述四种比对方式都不是相同节点，下面就在旧`VNode`节点中查找是否有与`E`节点相同的节点

**第七步：**发现旧`VNode`节点中没有`E`节点，那么就会在旧`VNode`开始指针前插入一个新的`E`节点

**第八步：**第一个节点操作完后，指针后移，继续进行比较，重复**第二至第七步**，结果为：**新增**、**删除**、**移动**

**第九步：**当找到相同节点时，会通过`patchVnode`进行这两个节点更细致的`Diff`

**总结：**每次`Diff`都会调用`updateChildren`方法来比较，就这样层层递归下去，直到将旧`VNode`和新`VNode`中的所有子节点比对完。`DomDiff`的过程更像是两个树的比较，每找到相同节点时，都会一层一层的往下比较它们的子节点，是一个**深度递归遍历比较**的过程。

## 总结

通过下图可以总结一下源码中`DomDiff`的过程

![DomDiff过程](https://raw.githubusercontent.com/Jokul518/fe-growth-path/master/imgs/vue/domdiff/Diff过程.png)

当然通过源码可以更高效的去编写Vue代码：

- 尽量不要跨层级的修改dom

- 设置key可以让diff更高效

- diff的效率并不是每种情况下都是最优的

- 在开发组件时，保持稳定的 DOM 结构会有助于性能的提升

  



