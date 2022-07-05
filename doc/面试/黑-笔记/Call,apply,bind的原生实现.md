# Call,apply,bind的原生实现

call和apply执行的本质是，往要绑定的context对象下添加该函数，然后执行，最好将属性删除，当context值为null，或者undefined时，非严格模式下，它将替换为window或者global全局变量。

Bind因为不会立刻执行，而是返回一个函数，一般情况下，该函数执行时的this指向绑定的对象，而麻烦的是js中该函数还可以通过new来实例化，而实例化后的this要指向新创建的对象，不能再跟着绑定的对象走了，所以该函数内部对this进行了额外处理，看它是否通过new创建的实例，如果是通过new创建的实例，this对象指向新创建的new对象实例。

## call的原生实现

```js
Function.prototype.call = function(context){
  var context = Object(context)||window;
  context.fn = this;
  var args = [];
  for(var i=1,len = arguments.length;i<len;i++){
    args.push('arguments['+i+']')
  }
  var result = eval('context.fn('+args+')');
  delete context.fn;
  return result;
}
```

## apply的原生实现

```js
Function.prototype.apply = function(context,arr){
  //Object构造函数为给定值创建一个对象包装器，如果给定值的null或undefined，将会创建并返回一个空对象，否则，将返回一个与给定值对应类型的对象
  var context = Object(context)||window;
  context.fn = this;
  var result;
  if(!arr){
    result = context.fn();
  }else{
    var args = [];
    for(var i=0,len = arr.length;i<len;i++){
      args.push('arr['+i+']');
    }
    result = eval('context.fn('+args+')');
  }
  delete context.fn;
  return result;
}
```

## bind的原生实现

```js
Function.prototype.bind = function(context){
  if(typeof this!=='function'){
    throw new TypeError('what is trying to be bound is not callback')
  }
  var _this = this;//保存原函数的执行环境
  var args = Array.prototype.slice.call(arguments,1)//保存之前传入参数
  var sub = function(){
    //把之前传入的参数和之后传入的参数合并
    //注意这里的arguments和函数外的arguments不是同一个
    var argsBind = args.concat(Array.prototype.slice.call(arguments));
    //判断函数是作为构造函数还是普通函数
    //如果是构造函数，返回true，把this继续绑定在context中
    //如果是普通函数，则this继续绑定在context中
    var env = this instanceof Super?this:context;
    return _this.apply(env,argsBind)
  }
  function Super(){}
  Super.prototype = this.prototype;
  sub.prototype = new Super()
  //上面三句话相当于sub.prototype = Object.create(this.protoype)
  return sub;//返回函数
}
```

