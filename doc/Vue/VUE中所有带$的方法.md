# Vue 中所有带$的方法

## 实例 Property

1. `vm.$data` :Vue 实例观察的数据对象。`Vue `实例代理了对其` data `对象 `property` 的访问。
2. `vm.$props`：当前组件接收到的 `props `对象。`Vue` 实例代理了对其 `props `对象 `property `的访问。
3. `vm.$el `:Vue 实例使用的根` DOM` 元素。
4. `vm.$options`:用于当前 Vue 实例的初始化选项。需要在选项中包含自定义 `property `时会有用处：
5. `vm.$parent`：父实例，如果当前实例有的话。
6. `vm.$root` :当前组件树的根 Vue 实例。如果当前实例没有父实例，此实例将会是其自己。
7. `vm.$children`：当前实例的直接子组件。需要注意 `$children` 并不保证顺序，也不是响应式的。如果你发现自己正在尝试使用 `$children `来进行数据绑定，考虑使用一个数组配合 `V-for `来生成子组件，并且使用 `Array` 作为真正的来源。
8. `vm.$slots`：用来访问被插槽分发的内容。每个具名插槽有其相应的 `property`(例如：`V-slot`：`foo`中的内容将会在 `vm.$slots.foo`。 中被找到)。`default property` 包括了所有没有被包含在具名插槽中的节点，或 `V-slot:default` 的内容。
9. `vm.$scopedslots`：用来访问作用域插槽。对于包括 默认` slot `在内的每一个插槽，该对象都包含一个返回相应 VNode 的函数。
10. `Vm.$refs`:一个对象，持有注册过 `ref attribute` 的所有 DOM 元素和组件实例。
11. `Vm.$isServer` :当前 Vue 实例是否运行于服务器。
12. `vm.$attrs`:包含了父作用域中不作为` prop` 被识别（且获取)的` attribute` 绑定(`class` 和 `style `除外)。当一个组件没有声明任何 `prop` 时，这里会包含所有父作用域的绑定 (`class `和` style `除外)，并且可以通过 `V-bind="$attrs"`传入内部组件——在创建高级别的组件时非常有用。
13. `Vm.$listeners`:包含了父作用域中的(不含` .native` 修饰器的) `v-on `事件监听器。它可以通过` V-on="$listeners"`传入内部组件——在创建更高层次的组件时非常有用。

## 实例方法/数据

1. `vm.$watch(exporFn, callback, [options] `：观察 Vue 实例上的一个表达式或者一个函数计算结果的变化。回调函数得到的参数为新值和旧值。表达式只接受简单的键路径。对于更复杂的表达式，用一个函数取代。
2. `vm.$set (target, propertyName/index，value )`：这是全局 `Vue.set `的别名。
3. `vm.$delete(target, propertyName/index)`:这是全局 `Vue.delete` 的别名。

## 实例方法/事件

1. `Vm.$on(event, cal1baak`)：监听当前实例上的自定义事件。事件可以由` Vm.$emit `触发。回调函数会接收所有传入事件触发函数的额外参数。
2. `vm.$once(event, callback)`：监听一个自定义事件，但是只触发一次。一旦触发之后，监听器就会被移除。
3. `Vm.$off(levent, callback〕)`：移除自定义事件监听器。
4. `Vm.$emit(eventName， L…args〕)`：触发当前实例上的事件。附加参数都会传给监听器回调。

## 实例方法/生命周期

1. `Vm.$mount([elementOrSelector〕)`：如果 Vue 实例在实例化时没有收到 el 选项，则它处于“末挂载”状态，没有关联的 DOM 元素。可以使用
2. `vm.$mount()`手动地挂载一个未挂载的实例。这个方法返回实例自身，因而可以链式调用其它实例方法。
3. `vm.$forceupdate()`：迫使 Vue 实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。
4. `vm. Snextrick(Icallback)`：将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待DOM 更新。它跟全局方法 `Vue.nextTick`一样，不同的是回调的 this 自动绑定到调用它的实例上。
5. `vm.$destroy()`：完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。

