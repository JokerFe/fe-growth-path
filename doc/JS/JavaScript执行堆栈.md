# JavaScript执行堆栈

这里的堆栈和js存储变量的堆栈意义不同。JavaScript代码执行的时候会将不同的变量存储于内存的不同位置：堆heap和栈stack中来加以区分。其中堆中存放一些对象，而栈中存放基本数据类型和对象的指针。

回到正题。JavaScript在执行可执行脚本的时候，首先会创建一个全局的可执行上下文globalContext，每执行一个函数的时候也会创建一个可执行上下文（executionContext EC）。为了管理这些执行上下文，js引擎创建了**执行上下文栈**（Execution Context Stack）ECS来管理这些执行上下文。当函数调用完成后，就会把当前函数的执行上下文销毁，回到上一个执行上下文... 这个过程会反复执行，直到执行中的代码执行完毕。需要注意的是，在ECS中永远会有globalContext垫底，永远存在于栈底。

在这个过程中要注意如下几个变量：

**1. 全局可执行上文**：globalContext

**2. 可执行上下文**：executionContext EC

**3. 执行上下文栈**：Execution Context Stack  ECS

**4. 变量对象**：Variable Object VO

**5. 活动对象**：Activation Object  AO

### 执行栈压栈顺序

一开始执行js代码的时候，就会创建一个全局可执行上下文global execution context压入执行上下文栈栈底，当调用了函数时，程序会创建一个新的EC，然后压入ECS中，当该函数中调用了其他的函数时，又会创建一个新的EC，然后压入栈中。一旦EC执行完毕后，就会从ECS中推出。

#### **变量对象**

变量对象VO是与执行上下文相关的特殊对象，用来存储上线文中的**函数声明**、**形参**和**变量。**

1. 函数声明FD，不包含函数表达式

1. 函数形参function arguments

1. 变量声明

#### **活动对象**

在函数上下文中，变量对象被激活为活动对象AO。活动对象在函数上下文中作为变量对象使用。活动对象又分为**创建阶段**和**激活/执行阶段**。

##### 1. 创建阶段

会发生**属性名的定义，而不进行变量赋值**。在此阶段会发生重要的**变量提升**。

- 在函数执行上下文中VO不能被直接访问，此时活动对象扮演着VO的角色

- Arguments对象，它包含如下属性：callee、length。在此阶段会对函数的形参进行赋值

- 内部定义的函数

- 以及绑定上对应的变量环境

- 内部定义的变量

- 不包含函数表达式

- 在此阶段所包含的内容和VO一样

##### 2. 激活/执行阶段

一旦创建阶段结束，便进入了激活/执行阶段，那么当前执行上下文就会对AO进行赋值。

执行上下文环境

下面来对比一下当前函数执行上下文的变化：

```js
function bar(){
  function foo(a,b){
    var c = 'Jokul',
    var d = function o(){}
    function e (){}
    (function f(){})
  }
  return foo(1,2)
}
// 创建阶段
foo:ExecutionContext={
  // 在此阶段进行变量提升
  AO:{
    arguments:{
      0:'1',
      1:'2',
      length:2
    },
    a:1,
    b:2,
    c:undefined,
    d:undefined,
    e:pointer to function c()
  },
  scopeChain:{Scope},
  VO:{...},
  Scope:[AO,globalContext.VO]
}
// 激活/执行阶段
foo:ExecutionContext={
  AO:{
    arguments:{
      0:'1',
      1:'2',
      length:2
    },
    a:1,
    b:2,
    c:'Jokul',
    d: pointer to function o(),
    e:pointer to function c()
  },
  scopeChain:{Scope},// 作用域链 即下边的Scope 包含 当前活动变量，父执行上下文的AO...以及全局执行上下文的VO
  VO:{...},
  Scope:[AO,barExecutionContext.AO,globalContext.VO], // 闭包的原理就是当bar环境已经被销毁，但是foo的作用域链中还保存着bar中的变量，这就形成了闭包。
  this:'运行时确认'// this的原理是动态绑定，永远指向ECS的栈顶
}
```

#### 总结

闭包的原理是Scope，this的原理是动态绑定，作用域链的原理是`Scope:[AO,barExecutionContext.AO,globalContext.VO]`。变量提升发生在AO的准备阶段，异步队列的原理是ECS。