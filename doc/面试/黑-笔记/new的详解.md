# new的详解

## new的DEMO

```js
function Animal(name){
  this.name = name;
}
Animal.color = 'black'
Animal.prototype.say = function(){
  console.log('I\'m'+this.name)
}
var cat = new Animal('cat')
console.log(cat.name,cat.height)
cat.say();//I'm cat
console.log(Animal.name,Animal.color)
Animal.say();//Animal.say is not a function
```

## DEMO解读

1-3行创建了一个函数`Animal`,并在其this上定义了属性：`name`,`name`的值是函数被执行时的形参。

第4行在`Animal`对象（`Animal`本身是一个函数对象）上定义了一个静态属性：`color`， 并赋值`black`	

5-7行在`Animal`函数的原型对象`prototype`上定义了一个`say()`方法，`say`方法输出了`this`的`name`值。

第8行通过`new`关键字创建了一个新对象`cat`

10-14行`cat`对象尝试访问`name`和`color`属性，并调用`say`方法

16-20行`Animal`对象尝试访问`name`和`color`属性，并调用`say`方法

## 重点解析

`var cat = new Animal('cat')`，js引擎在执行这行代码时，做了很多工作，用伪代码模拟其工作流程如下：

```js
var obj = {};
obj.__proto__ = Animal.prototype;
var result = Animal.call(obj,'cat');
return typeof result === 'obj'?result:obj;
```

1. 创建一个空对象`obj`

2. 把`obj`的`proto`指向`Animal`的原型对象`prototype`，此时便建立了`obj`对象的原型链

   `obj->Animal.prototype->Object.prototype->null`

3. 在`obj`对象的执行空间调用`Animal`函数并传递参数`cat`，相当于`var result=obj.Animal('cat')`，当这句执行完之后，`obj`便产生了属性`name`并赋值为`cat`

4. 考察第3步返回的返回值，如果无返回值或者返回一个非对象值，则将obj返回作为新对象，否则将返回值作为新对象返回。

5. 所以我们发现cat的原型链是这样的

   `cat->Animal.prototype->Object.prototype->null`,

   但是Animal 的原型链是这样的

   `Animal->Function.prototype->Object.prototype->null`

   因此Animal的原型链上没有定义say方法

## 总结

JavaScript的new关键字的作用是继承，上面例子中，cat对象在产生时便继承了Animal中定义的方法和属性。

