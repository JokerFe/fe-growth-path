[toc]

## ES5

### js执行堆栈

🍊**可执行上下文栈**：js 在执行脚本的时候首先会创建一个全局可执行上下文globalContext，每执行一个函数就会创建这个函数的可执行上下文executionContext。为了管理这些可执行上下文，js引擎维护了执行上下文栈Execution Context Stack来管理这些可执行上下文。就是js同步执行队列。当函数调用完成后，就会把当前函数的执行上下文销毁，回到上一个执行上下文...这个过程反复执行，直到执行栈中的胆码执行完毕，go永远存在于ecs的栈低，直至该脚本执行完毕。

🍊**AOVOGO**： **变量对象VO**与可执行上下文相关的特殊对象，用来存储上下文中的**函数声明、形参**和**变量**。在函数上下文中，变量对象会被激活为**活动对象AO**，分为创建阶段和执行阶段。它包含VO内的并且包含**scopeChain**、一系列父执行上线文**VO**、**Scope：[AO,barExecutionContext.AO,globalContext.VO]**、**this**(运行时确认)。

🍊 **作用域链的原理**就是Scope:[AO,barExecutionContext.AO,globalContext.VO]。**闭包的原理**就是Scope，当bar环境已经被销毁，但是foo的作用域链中还保存着bar中的变量，这就形成了闭包。**this的原理**就是动态绑定，永远指向ECS的栈顶。**变量提升**发生在AO的准备阶段。**异步队列的原理**就是ECS。

### 作用域与闭包

🍊**作用域**是【**变量的可访问性和可见性**】。它的主要作用就是安全性，【**它保证了变量只能在特定的区域内才能被访问，有了作用域我们就可以避免在程序其它位置意外对某个变量做出修改**】。`作用域在词法化阶段（编译阶段）确定`。js作用域又分为全局作用域、函数作用域和块级作用域。函数作用域就是在函数的全部变量可以在整个函数的范围内使用及复用，包括它内部的嵌套作用域。块级作用域，一对花括号就是一个块作用域 ，ES5实现块级作用域的方式有：eval、with、try/catch的catch分句、闭包。ES6的就是let和const。

🍊**作用域链**：作用域链的产生是因为作用域发生嵌套。它是当前作用域环境和上层环境的一系列变量对象组成的，它保证了当前执行环境对符合访问权限的变量和函数的有序访问。当查找变量的时候，首先会在当前作用域内查找，如果没有，则去上层作用域环境查找，直到找到全局上下文及全局变量。这个由多个执行上下文的变量对象构成的链表叫做作用域链。

🍊**闭包：**MDN的概念是：那些能访问自由变量的函数就是闭包。自由变量是既不是函数的参数也不是函数内部声明的变量。**实际上**即使创建它的上下文已经被销毁，它依然存在，并引用自由变量。闭包是在函数被调用的时候才会被确定创建的，闭包的形成与作用域链的访问顺序有直接的关系，只有内部函数访问上层作用域链中的变量对象才会形成闭包。**闭包的好处：**立即执行函数、类库封装、隔离作用域、避免变量污染、实现类和继承。**闭包的缺点：**内存泄露、this指向、引用的外部变量修改时不会在闭包内生效、for循环形成闭包。**哪些是闭包：**所有的回调函数、定时器、事件触发、监听。 **闭包的优化**：回调函数避免使用自由变量、及时将定时器置为null、及时清除监听的事件。**造成内存泄露的原因：**全局变量、闭包、dom删除或者清空时绑定的事件未清除。

🍊 **将闭包和作用域链的原理引到js执行上下文。**

### 原型链

1. 每个函数都有一个属性prototype，prototype的属性是一个对象，浏览器会给其开辟一个堆内存；原型对象上存储的属性和方法，就是给当前类实例所调用的共有属性和方法
2. 类的prototype原型对象中，默认存在一个内置的属性 constructor，属性值就是当前类本身，所以我们把类称作【构造函数】
3. 每个对象也都有一个`__proto__`，属性是当前实例对象所属类的prototype原型
4. 万物皆对象，Object是所有对象的基类，js的所有值的`__proto__`向上查找，都会指向`Object.prototype`.而`Object.prototype.__proto__`指向了null

![](https://cdn.nlark.com/yuque/0/2019/png/225909/1574826330223-ec376534-f1ac-4318-8b07-ef08d6d870aa.png?x-oss-process=image/watermark,type_d3F5LW1pY3JvaGVp,size_10,text_Sm9rdWw=,color_FFFFFF,shadow_50,t_80,g_se,x_10,y_10)

1. **实例的隐式原型等于构造函数的显式原型**，f1.**proto**==Foo.prototype
2. 函数类型有prototype，对象有**proto**
3. 所有的构造函数也属于函数，所以Foo/Object.**proto**==Function.protoype
4. 函数的构造函数也属于函数，所以Function.**proto**== Function.protoype
5. `Object.prototype.**proto** == null`



#### new和继承

### 继承

🍊原型链

实现原理

构造函数、原型和实力之间的关系：每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个原型对象的指针。继承的本质就是复制，即重写原型对象，代之以一个新类型的实例。

存在的问题

1. 当原型链中包含引用类型值得原型时，该引用类型值会被所有实例共享
2. 在创建子类型时，不能向超类型的构造函数中传递参数

代码

```js
function SuperType() {
    this.property = true;
}

SuperType.prototype.getSuperValue = function() {
    return this.property;
}

function SubType() {
    this.subproperty = false;
}

// 这里是关键，创建SuperType的实例，并将该实例赋值给SubType.prototype
SubType.prototype = new SuperType(); 

SubType.prototype.getSubValue = function() {
    return this.subproperty;
}

var instance = new SubType();
console.log(instance.getSuperValue()); // true
```

🍊 借用构造函数

实现原理

1. 使用父类的构造函数来增强子类实例，等同于父类的实例给子类（不通过原型）
2. 核心代码是SuperType.call(this)，创建子类实例时调用SuperType构造函数，于是SubType的每个实例都会将SuperType中的属性复制一份。

存在的问题

1. 只能集成父类的属性和方法，不能继承原型属性和方法
2. 无法实现复用，每个子类都有父类实例函数的副本，影响性能

代码

```js
function  SuperType(){
    this.color=["red","green","blue"];
}
function  SubType(){
    //继承自SuperType
    SuperType.call(this);
}
var instance1 = new SubType();
instance1.color.push("black");
alert(instance1.color);//"red,green,blue,black"

var instance2 = new SubType();
alert(instance2.color);//"red,green,blue"
```

🍊 组合继承

实现原理

组合上述两种方法就是组合继承，用原型链实现对原型属性和方法的继承，用构造函数技术来实现实例属性的继承

代码

```js
function SuperType(name){
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function(){
  alert(this.name);
};

function SubType(name, age){
  // 继承属性
  // 第二次调用SuperType()
  SuperType.call(this, name);
  this.age = age;
}

// 继承方法
// 构建原型链
// 第一次调用SuperType()
SubType.prototype = new SuperType(); 
// 重写SubType.prototype的constructor属性，指向自己的构造函数SubType
SubType.prototype.constructor = SubType; 
SubType.prototype.sayAge = function(){
    alert(this.age);
};

var instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
alert(instance1.colors); //"red,blue,green,black"
instance1.sayName(); //"Nicholas";
instance1.sayAge(); //29

var instance2 = new SubType("Greg", 27);
alert(instance2.colors); //"red,blue,green"
instance2.sayName(); //"Greg";
instance2.sayAge(); //27
```

🍊 原型式继承

实现原理

1. 利用一个空对象作为中介，将某个对象直接赋值给空对象构造函数的原型
2. object()对传入其中的对象执行一次浅复制，将构造函数F的原型直接指向传入的对象

存在的问题

1. 原型链继承多个实例的引用类型属性指向相同，存在篡改的可能
2. 无法传递参数

代码

```js
function object(obj){
  function F(){}
  F.prototype = obj;
  return new F();
}
// 上面这段代码可以用Object.create()代替

var person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"]
};

var anotherPerson = object(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");

var yetAnotherPerson = object(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");

alert(person.friends);   //"Shelby,Court,Van,Rob,Barbie"
```

🍊 寄生式继承

实现原理

1. 在原型式继承的基础上，增强对象，返回构造函数
2. 函数的主要作用时为构造函数新增属性和方法，以此增强函数

存在的问题

- 原型链继承多个实例的引用类型属性指向相同，存在篡改的可能
- 无法传递参数

代码

```js
function createAnother(original){
  var clone = object(original); // 通过调用 object() 函数创建一个新对象
  clone.sayHi = function(){  // 以某种方式来增强对象
    alert("hi");
  };
  return clone; // 返回这个对象
}

var person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"]
};
var anotherPerson = createAnother(person);
anotherPerson.sayHi(); //"hi"
```

🍊 寄生组合式继承

> 这是最成熟的方法，也是现在库的实现方法

实现原理

1. 结合借用构造函数传递参数和寄生模式实现继承
2. 这个例子的高效率体现在它只调用一次SuperType构造函数，并且因此避免了在SubType.prototype上创建不必要的多余属性。榆次同时，原型链还能保持不变；因此还能够正常使用instanceof和isPrototypeOf()

代码

```js
function inheritPrototype(subType, superType){
  // 创建对象，创建父类原型的一个副本
  var prototype = Object.create(superType.prototype);
  // 增强对象，弥补因重写原型而失去的默认的constructor 属性
  prototype.constructor = subType;
  // 指定对象，将新创建的对象赋值给子类的原型
  subType.prototype = prototype;
}

// 父类初始化实例属性和原型属性
function SuperType(name){
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function(){
  alert(this.name);
};

// 借用构造函数传递增强子类实例属性（支持传参和避免篡改）
function SubType(name, age){
  SuperType.call(this, name);
  this.age = age;
}

// 将父类原型指向子类
inheritPrototype(SubType, SuperType);

// 新增子类原型属性
SubType.prototype.sayAge = function(){
  alert(this.age);
}

var instance1 = new SubType("xyc", 23);
var instance2 = new SubType("lxy", 23);

instance1.colors.push("2"); // ["red", "blue", "green", "2"]
instance1.colors.push("3"); // ["red", "blue", "green", "3"]
```

### new

1. 创建一个空的简单JavaScript对象（即`**{}**`）；
2. 链接该对象（即设置该对象的构造函数）到另一个对象 ；
3. 将步骤1新创建的对象作为`**this**`的上下文 ；
4. 如果该函数没有返回对象，则返回`**this**`。

```javascript
function objectFactory() {
    var obj = new Object(),
    Constructor = [].shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    var ret = Constructor.apply(obj, arguments);
    return typeof ret === 'object' ? ret : obj;
};
```

### 类型判断

- 用 typeof 来判断变量类型的时候，我们需要注意，最好是用 typeof （除了Function之外的所有构造函数的类型都是'object'。）来判断基本数据类型（包括symbol），避免对 null 的判断。
- 需要注意当用typeof来判断null类型时的问题，如果想要判断一个对象的具体类型可以考虑使用
- instanceof（instanceOf的主要实现原理就是只要右边变量的prototype在左边变量的原型链上即可），但是很多时候它的判断有写不准确。
- 当我们在要准确的判断对象实例的类型时，可以使用Object.prototype.toString.call()进行判断。因为Object.prototype.toString.call()是引擎内部的方式。

### this指向

1. 全局环境、普通函数（非严格模式）this都指向window

2. 普通函数（严格模式）指向undefined
3. 函数作为对象方法及原型链指向的都是上一级对象
4. 构造函数指向构造的实例
5. DOM事件中指向触发事件的元素
6. 箭头函数指向它父级的环境

### [异步事件队列](https://www.yuque.com/guohh/yo6wpa/tmazrg)

🍊**五大线程:**GUI渲染线程、js引擎线程、事件触发线程、定时处理线程、异步http请求线程

🍊**事件循环：**事件循环机制和异步队列的维护是由事件触发线程控制的。它维护一个异步事件队列。JS引擎会维护一个同步执行栈，同步代码会依次加入执行栈中进行，执行结束后出站。如果遇到异步，就会交给对应的线程来完成异步任务，等异步任务执行完成，然后由事件触发线程将异步对应的回到函数加入到异步事件队列中。等同步执行栈中的任务执行完毕，事件触发线程就会从异步事件中取出最先加入的异步回调函数进行执行，提取规则遵循先入先出的规则，异步事件队列类似队列的数据结构。

🍊**微任务宏任务**

**macrotask:**

- 主代码块

- setTimeout

- setInterval

- I/O（ajax）

- UI rendering

- setImmediate(nodejs)

- 可以看到，事件队列中的每一个事件都是一个 macrotask，现在称之为宏任务队列

**microtask:**

- Promise

- Object.observe(已经废弃)

- MutationObserver

- process.nextTick(nodejs)

**执行顺序**

1. 执行一个宏任务（栈中没有就从事件队列中获取，可以理解为一个script标签）
2. 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
3. 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
4. 当前微任务执行完毕，开始检查渲染，然后GUI线程接管渲染
5. 渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取）

![微任务宏任务](https://cdn.nlark.com/yuque/0/2019/png/225909/1576857708932-a255d383-b096-4be9-82f2-2d06ebb8a1de.png)

### [数据存储](https://www.yuque.com/guohh/yo6wpa/ykuyfv)

#### 数组API

构造函数。静态方法Array.isArray()。实例方法valueOf()，toString()、push()、pop()、shift()，unshift()、join()、concat()、reverse()、slice()、splice()、sort()、`map()、forEach()、filter()、some()，every()、reduce()、reduceRight()`、 indexOf()、lastIndexOf()链式使用

#### 对象API

##### **Object.create()**

创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。

##### Object.defineProperties()

直接在一个对象上定义新的属性或修改现有属性，并返回该对象。`Object.defineProperties(obj, props)`

- `configurable`

  `true` 当且仅当该属性描述符的类型可以被改变并且该属性可以从对应对象中删除。 **默认为 `false`**

- `enumerable`

  `true` 当且仅当在枚举相应对象上的属性时该属性显现。 **默认为 `false`**

- `value`

  与属性关联的值。可以是任何有效的JavaScript值（数字，对象，函数等）。 **默认为 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined).**

- `writable`

  `true`当且仅当与该属性相关联的值可以用[assignment operator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Assignment_Operators)改变时。 **默认为 `false`**

- `get`

  作为该属性的 getter 函数，如果没有 getter 则为[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)。函数返回值将被用作属性的值。 **默认为 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)**

- `set`

  作为属性的 setter 函数，如果没有 setter 则为[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)。函数将仅接受参数赋值给该属性的新值。
  **默认为 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)**

##### Object.defineProperty()

直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。`Object.defineProperty(obj, prop, descriptor)`

* obj 要在其上定义属性的对象。

* prop 要定义或修改的属性的名称。
* descriptor 将被定义或修改的属性描述符

##  事件代理

- 事件代理就是在祖先级DOM元素绑定一个事件，当触发子孙级DOM元素的时间时，利用事件流的原理来触发绑定祖先级DOM的时间。
- **事件流**：分为3个阶段 捕获阶段(从根元素一步一步寻找目标dom)、目标阶段(找到目标dom)、冒泡阶段(当目标dom触发事件后，会一步一步的向它的祖先dom冒泡)。
- 可用addEventListener(eventName,handles,boolean)和removeEventListener()方法处理指定和删除事件处理程序的操作，两个方法都可接受三个参数，要处理的事件名、事件处理程序的函数、boolean，布尔值为true，表示在捕获阶段调用事件处理程序。false时表示在事件冒泡阶段调用事件处理程序，一般建议在冒泡阶段使用。
- jq实现事件代理的方式：直接click、bind()、delegate()、live()、on()

## null和undefined区别

本质

- null
  - 表示没有对象，此处不应该有值
  - 典型用法
    - \1. 作为函数的参数，表示函数的参数不是对象
    - \2. 作为对象原型链的终点
- undefined
  - 表示缺少值，此处应该有一个值，但是没有定义
- 典型用法
  - 变量呗声明了，但是没有赋值是，就等于undefined
  - 调用函数是，应该提供的参数没有提供，该参数等于undefined
  - 对象没有赋值的属性，该属性的值为undefined
  - 函数没有返回值是，默认返回undefined

其他对比

- typeof null ☞ object
- typeof undefined ☞ undefined
- Object.prototype.toString.call(null)   => "[object Null]"
- Object.prototype.toString.call(undefined) => "[object Undefined]"
- Number(null) ☞ 0
- Number(undefined) ☞ NaN
- null == undefined
- null !== undefined
- 都为false

## call apply bind

- call、apply和bind都是Function.prototype上的方法
- call和apply都是修改function的this指向的，都是立即执行该函数
- call的第一个参数是绑定的this指向，其他的参数依次传入
- apply的第一个参数是绑定this的指向，其他参数以数组的形式传递
- bind是只修改this的指向，不立即执行函数，参数形式和call一样

## for in 和 for of的区别

- for in

  - 会遍历自身的属性，还会遍历原型上的属性

- for of

  - 需要有迭代器方法的数据类型

  - Iterator，一种接口，目的是为不同的数据结构提供统一的数据访问机制

  - Symbol.iterator属性

  - ```js
    var iterableObj = {
        items:[100,200,300],
        [Symbol.iterator]:function(){
        var self=this;
        var i = 0;
        return {
            next: function() {
                var done = (i >= self.items.length);
                var value = !done ? self.items[i++] : undefined;
                return {
                    done: done,
                    value: value
                };
            }
        };
        }
    }
    ```









# ES5+

## 箭头函数

- 箭头函数语法比普通函数更加简洁
- 箭头函数没有自己的this，它的this是继承它所在的执行上下文环境
- 箭头函数的this无法修改，不能通过call、apply、bind进行修改。强行使用时会忽略第一个参数
- 箭头函数没有显式原型 为undefined
- 箭头函数不能作为构造函数执行，因为它没有prototype
- 和new一起使用会抛出错误 not a constructor
- 箭头函数没有arguments
- 箭头函数不能作为generator函数，不能使用yield关键字

## 模块化

目的

- 【可维护性】：根据定义，每个模块都是独立的。良好设计的模块会尽量与外部的代码撇清关系，以便于独立对其进行改进和维护。维护一个独立的模块比起一团凌乱的代码来说要轻松很多
- 【可复用性】：现实来讲，在日常工作中我们经常会复制自己之前写过的代码到新项目中, 有了模块, 想复用的时候直接引用进来就行。
- 【命名空间】：在JavaScript中，最高级别的函数外定义的变量都是全局变量（这意味着所有人都可以访问到它们）。也正因如此，当一些无关的代码碰巧使用到同名变量的时候，我们就会遇到“命名空间污染”的问题。

commonJS和ES6 modules

- commonJS
  - 服务层
  - 运行时加载
  - 输出的是整个文件
  - 值的引入是直接导入的
  - this指向当前模块
- ES6
  - 浏览器端
  - 编译时加载/ 延迟加载
  - 导出某个接口，可按需加载
  - 异步加载
  - 值是引用的，执行时获取值
  - this指向undefined
- AMD vs. CommonJS
  - AMD是依赖提前加载,CMD是依赖延时加载
  - commonjs是同步加载的。主要是在nodejs 也就是服务端应用的模块化机制，通过module.export 导出声明，通过require('')加载。每个文件都是一个模块。他有自己的作用域，文件内的变量，属性函数等不能被外界访问。node会将模块缓存，第二次加载会直接在缓存中获取。
  - AMD是异步加载的。主要应用在浏览器环境下。requireJS是遵循AMD规范的模块化工具。他是通过define()定义声明，通过require('',function(){})加载。
  - ES6的模块化加载时通过export default 导出 用import导入 可通过 {} 对导出的内容进行解构
  - ES6的模块的运行机制与common不一样，js引擎对脚本静态分析的时候，遇到模块加载指令后会生成一个只读引用，等到脚本真正执行的时候才会通过引用去模块中获取值，在引用到执行的过程中 模块中的值发生了变化，导入的这里也会跟着变，ES6模块是动态引用，并不会缓存值，模块里的比那辆绑定所在的模块。

## require的查找机制

不带路径

- require("mymodule") 或者 require("http")
- 先原生模块
- 再去node_modules中查找
  - 先当成文件搜索
    - 依次添加 js json node后缀名查找。
    - 如果没有则跳转到上级目录的node_module中查找, 依次循环, 直到到达根目录.
  - 在当成目录搜索
    - 依次在目录中查找package.json index.js index.json index.node文件,
    - 如果没有则跳转到上级目录的node_module中查找, 依次循环, 直到到达根目录.

带路径

- 如 require("/x") require("./x") require("../x") 
- 根据这些路径生成绝对路径, 然后在绝对路径中依次把x当成文件 目录进行查找.