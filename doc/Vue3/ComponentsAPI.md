# Compitition-Api

## 简介

> `@vue/composition-api` provides a way to use `Vue 3.0`'s **Composition api** in `Vue 2.x`.

> `@vue/composition-api` 使开发者们可以在 `Vue 2.x` 中使用 `Vue 3.0` 引入的**基于函数**的**逻辑复用机制**。

首先要了解一下Composition API 设计的好处在哪里？**逻辑组合和复用**、**类型推导**、**打包尺寸**等。

在vue3.0之前所有的组件都可以看做一个可选项的配置集合，通过data、computed、methods、watch以及created、mounted等生命周期函数，用这个可选项集合来声明一个组件。

这样写的好处是组织结构清晰，但是在逻辑复用上就不太友好了。我们都知道，js中最简洁清晰的复用方式就是将逻辑封装到一个函数中，然后函数与函数之间相互调用。

Vue3.0很好的支持了Typescript，而Typescript的最重要的一个特性就是类型推导，而函数相对于嵌套的对象来说对类型推导更加的友好。

另外，以函数形式组织的模块以具名方式导入使用，在`tree-sharking`的时候支持会更好。

## 初始化项目

1. 安装vue-cli3

   ```shell
   sudo npm install @vue/cli -g
   ```

2. 创建项目

   ```shell
   vue create new-composition
   ```

3. 安装`composition-api`，使用vue3新特性

   ```shell
   npm install @vue/composition-api --save
   ```

4. 在使用新特性前，必须通过`vue.use()`进行挂载

   ```js
   import Vue from 'vue'
   import VueCompositionApi from '@vue/composition-api'
   
   Vue.use(VueCompositionApi)
   ```

> 完成上述4个步骤创建完项目后，就可以在对应的vue文件中`按需引用`你所需要的函数进行使用。

## setup函数

`setup()`函数式vue3中专门为组件提供的一个新属性，它是我们在使用vue3的`composition-api`的统一入口。也就是说我们使用的新特性都要在这个函数中进行。

### 执行时机

**setup**函数会在`beforeCreate()`之后，`created()`之前执行。

### 参数

* props
* context

##### 接受props数据

1. 第一步和之前的写法一样，需要在`props`中定义外界传入的参数类型等

   ```javascript
   props: {
   	p: String
   }
   ```

2. **setup**函数的第一个形参就是用来接受`props`数据的。

   ```javascript
   setup(props) {
   	console.log(props);
   }
   ```

##### context

setup函数的第二个形参是一个**上下文对象**，它包含了一下在vue2中组件实例的一些属性(需要通过this来调用的)，包括如下：

```javascript
setup(props, context) {
  console.log(props);
  console.log(context);
  console.log(context.attrs);
  console.log(context.slots);
  console.log(context.parent);
  console.log(context.root);
  console.log(context.emit);
  console.log(context.refs);
}
```



> 注意：在setup函数中，无法访问this。

## 响应式数据声明

在vue2中创建响应式数据的方式为：`data`、`props`； 其中data中的数据是双向的，而props中的数据的单向的。 在新特性中有两种方式能创建响应式数据：`reactive()`和`ref()`。

### reactive

`reactive()`函数接收一个普通对象，返回一个响应式的数据对象。 等价于vue2中的`Vue.observable()`函数。下面实现一个数量加一的操作。

在新特性中有两种方式能创建响应式数据

等价于vue2中的`Vue.observable()`函数。下面实现一个数量加一的操作。

```vue
<template>
    <div>
        <div>{{count}}</div>
        <button @click="count+=1">+1</button>
    </div>
</template>
<script>
import { reactive } from "@vue/composition-api";
export default {
    setup(props, context) {
        const state = reactive({ count: 0 });
        return state;
    }
};
</script>
```

需要注意的是页面需要的数据必须在函数最后retrun出来，才能在页面模板中使用。

### ref

`ref()`函数将一个给定的值转为响应式的数据对象，它返回一个对象，响应式的数据值需要通过调用`value`属性访问，而在页面模板中则可直接访问。如上实现一个数量加一的操作。

```vue
<template>
    <div>
        <div>{{count}}</div>
        <button @click="count+=1">+1</button>
    </div>
</template>
<script>
import { ref } from "@vue/composition-api";
export default {
    name: "ref",
    setup() {
        const count = ref("1");
        console.log(count.value);
        count.value++;
        console.log(count.value);
      
        return {
            count
        };
    }
};
</script>
```

### 数据声明的注意事项

* 不要使用Array直接存取ref对象
* 不要在数组中使用含有ref的普通对象
* 应该总是将ref存放到reactive对象中
* reactive会返回一个修改过的原始对象
* 通过`...`处理的`reactive`对象不是响应式数据
* `reactive`存放的ref对象会重名覆盖

### isRef

`isRef()`用来判断某个值是否为`ref()`函数创建出来的对象。

### toRefs

`toRefs()`函数可以将`reactive`创建出来的响应式对象转换为通过`ref()`创建出来的响应式对象。

```vue
<template>
    <div ref="app">
        <div>{{count}}</div>
        <button @click="add">+1</button>
    </div>
</template>
<script>
import { reactive, toRefs } from "@vue/composition-api";
export default {
    name: "toRefs",
    setup() {
        const state = reactive({
            count: 0
        });
        const add = () => [state.count++];

        return {
            ...toRefs(state),
            add
        };
    }
};
</script>
```

## computed

`computed()`用来创建计算属性，`computed()`函数的返回值是一个`ref`的实例。

### 创建只读的计算属性

在调用`computed()`函数期间，传入一个函数，可以得到一个只读的计算属性

### 创建可读可写的计算属性

在调用`computed()`函数期间，传入一个包含get和set的对象，可以得到一个可读可写的计算属性。

```vue
<template>
    <div class="computed">
        {{computedCountReadOnly}}
        <button @click="refCountReadOnly+=1">+1</button>
        <div>{{computedCountReadWrite}}</div>
    </div>
</template>
<script>
import { ref, computed } from "@vue/composition-api";
export default {
    setup() {
        const refCountReadOnly = ref(0);
        // 只读的计算属性
        const computedCountReadOnly = computed(
            () => refCountReadOnly.value + 1
        );
        // computedCountReadOnly.value = 9; // 这行代码会报错

        // 可读可写的计算属性
        const refCountReadWrite = ref(0);
        const computedCountReadWrite = computed({
            set: val => {
                refCountReadWrite.value = val - 1;
            },
            get: () => refCountReadWrite.value + 1
        });
        computedCountReadWrite.value = 11;

        return {
            refCountReadOnly,
            computedCountReadOnly,
            refCountReadWrite,
            computedCountReadWrite
        };
    }
};
</script>
```

## Watch

`watch()`函数用来监听某些数据的变化，从而触发某些特定的操作。

#### 基本用法

```js
const refCount = ref(0);

watch(() => console.warn(refCount.value));

setInterval(() => {
  refCount.value++;
}, 1000);
```

#### 监视多个数据源

```js
// reactive
const state = reactive({ count: 0, name: "jokul" });
watch(
  [() => state.count, () => state.name],
  ([newCount, newName], [oldCount, oldName]) => {
    console.log(`reactive $count 旧值：${oldCount}; 新值：${newCount}`);
    console.log(`reactive $name 旧值：${oldName}; 新值：${newName}`);
  },
  {
    lazy: true
  }
);

setTimeout(() => {
  state.count = 27;
  state.name = "Jokul";
}, 2000);

// ref
let refCount = ref(0);
let refName = ref("guohh");
watch(
  [refCount, refName],
  ([newCount, newName], [oldCount, oldName]) => {
    console.log(`ref $count 旧值：${oldCount}; 新值：${newCount}`);
    console.log(`ref $name 旧值：${oldName}; 新值：${newName}`);
  },
  {
    lazy: true
  }
);

setTimeout(() => {
  refCount.value = 27;
  refName.value = "Jokul";
}, 2000);
```

#### 清除监听

在`setup()`函数中创建的`watch()`监听，会在当前组件被销毁的时候自动清除，如果想要明确地或者提前结束某个监听，可以调用`watch()`的返回值。

```js
// 定义变量接受watch函数的返回值 返回值为function
const removeWtach = watch(()=>{})
// 调用返回值函数，清除监听
removeWtach()
```

#### 在watch中清除无效的异步任务

有时候当被`watch`函数监视的值发生变化时，或者`watch`本身被`stop`之后，我们期望能够清楚哪些无效的异步任务，此时，`watch`回调函数提供了一个清除函数来执行清除工作。调用场景：

* `watch`被重复执行
* `watch`被强制`stop`

```vue
<template>
    <div>
        <input type="text" v-model="keyword" />
    </div>
</template>
import { ref, watch } from "@vue/composition-api";
<script>
	setup(){
    const keyword = ref("");

    const asyncprint = val => {
      return setTimeout(() => {
        console.log(val);
      }, 1000);
    };

    watch(
      keyword,
      (newVal, oldVal, clean) => {
        const timer = asyncprint(newVal);
        clean(() => clearTimeout(timer));
      },
      { lazy: true }
    );

    return { keyword };
  }
</script>
```

## 生命周期

新的生命周期函数需要按需导入，并且在setup函数内使用。`vue2.x`与新版`Composition API`的关系：

* `beforeCreate()`  ☞  `setup()`
* `created()`  ☞  `setup()`
* `beforeMount()`  ☞  `onBeforeMount()`
* `mounted()`  ☞  `onMounted()`
* `beforeUpdate()`  ☞  `onBeforeUpdate()`
* `updated()`  ☞  `onUpdated()`
* `beforeDestory()`  ☞  `onBeforeUnmount()`
* `destoryed() ` ☞  `onUnmounted()`
* `errorCaptured()`  ☞ ` onErrorCaptured() `

```js
setup(){
  onBeforeMount(()=>{
    console.log("onBeforeMount")
  })
  onMounted(()=>{
    console.log("onMounted")
  })
  onBeforeUnmount(()=>{
    console.log("onBeforeUnmount")
  })
  // ...
}
```

## provide & inject

在`vue2.x`的时候，我们可以使用provide和inject实现嵌套组件之间的数据传递，但是在`setup()`函数内使用。

```js
// 父组件
setup() {
  const father = ref("父组件传递的");
  provide("father", father);
}

// 子组件
setup() {
  const data = inject("father");
  return {
    data
  };
}
```

## 获取页面DOM或者组件

```vue
<template>
    <div ref="divRef">页面dom</div>
</template>
<script>
import { ref, onMounted } from "@vue/composition-api";
export default {
    setup() {
        const divRef = ref(null);

        onMounted(() => {
            divRef.value.style.color = "blue";
        });

        return {
            divRef
        };
    }
};
</script>
```

## defineComponent

这个函数仅仅提供了类型推断，主要是为了更好的结合TypeScript来使用，能为setup()函数中的props提供完整的类型推断。

```vue
<script>
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
    props: {
        foo: String
    },
    setup(props) {
        console.warn(typeof props.foo);
    }
});
</script>
```

当传递一个数字的foo时，页面就会报错

```js
[Vue warn]: Invalid prop: type check failed for prop "foo". Expected String with value "0", got Number with value 0.
```

