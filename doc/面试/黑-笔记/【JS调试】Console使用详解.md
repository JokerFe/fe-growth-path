## 【JS调试】Console使用详解

## 凡人视角

### 打印字符串

代码：

```js
console.log('I am a 凡人')
```

### 打印提示信息

代码：

```js
console.info('yes,you are a 凡人')
```

### 打印警告信息

代码：

```js
console.warn('凡人你居然敢藐视我')
```

### 打印错误信息

代码：

```js
console.error('天兵天将，把这个凡人给我打入地狱')
```

### 打印调试信息

代码：

```js
console.debug("我就是传说中的debug");
```

## 上帝视角

### 查看所有方法

console 除了上面的几个方法还有什么方法呢？log 除了能打印字符串外，还能打印出对象，我们可以利用 console.log 打印自己。

代码：

```js
console.log(console);
```

输出：

```js
Object {
    assert: ...,
    clear: ...,
    count: ...,
    debug: ...,
    dir: ...,
    dirxml: ...,
    error: ...,
    group: ...,
    groupCollapsed: ...,
    groupEnd: ...,
    info: ...,
    log: ...,
    markTimeline: ...,
    profile: ...,
    profileEnd: ...,
    table: ...,
    time: ...,
    timeEnd: ...,
    timeStamp: ...,
    timeline: ...,
    timelineEnd: ...,
    trace: ...,
    warn: ...
}
```

啊咧咧？怎么这么多方法。其实上面的 console 方法 不一定每个浏览器 都有实现，我这边使用的是 chrome浏览器 。所以说，这个特性是非标准的，请尽量不要在 生产环境 中使用它。

但是我们可以在 开发环境 中，合理的利用 这些方法来帮助我们开发。

### 清理控制台

如果我们在控制台调试的时候，难免 强迫症 发作想清理掉已经乱七八糟的控制台。浏览器和命令行 clear 一样提供了一个清理函数

```js
console.clear() 
```

当然我们也可以用 chrome 的 command line api 来清理控制台。

```js
clear()
```

又或者可以使用按键Mac上 cmd + k ，Win ctrl + l（我用的是chrome浏览器）。

### 分组

当代码非常长，或者我们需要把一个函数，或者一个文件中的函数等区分出来。我们可以使用分组来实现。

代码：

```js
console.group('凡人');
console.log("手");
console.log("脚");
console.groupEnd();

console.group('神');
console.log("法力无边");
console.log("腾云架雾");
console.groupEnd();
```

输出：

如果想要输出为折叠，我们可以使用

```
console.groupCollapsed
```

，用法和 console.group 类似。

### 查看对象信息

有时候我们需要打印出对象信息,可以使用 console.log 来进行简单的输出。

代码：

```js
var person = {
    head: 1,
    hand: 2,
    leg: 2
};
console.log(person);
```

呜呜，可是这个显示得好丑，我们这个时候就可以使用传说中的神器 console.table 来帮助我们清楚的显示 关联数组信息。

```js
var data = [
    {
        '姓名': '幼儿园', 
        '性别': '女'
    },
    {
        '姓名': '李狗嗨',
        '数量': 1
    }
];
console.table(data);
```

但是如果想要看详细的对象信息，我们可以使用 console.dir，将一个 JavaScript 对象的所有属性和属性值显示成一个可交互的列表，它还能打印出函数等。

```js
console.dir(clear);
```

什么？你想看某个节点中的html代码？没事，我们可以用 console.dirxml 来查看页面中对应元素的 html/xml 内容。

html代码：

```html
<div id='person'>
    <p>I am a 凡人</p>
</div>
```

javascirpt代码：

```js
var person = document.getElementById('person');
console.dirxml(person)；
```

### 性能测试

雷军粑粑老是喜欢说：“不服？跑个分。”有时候，我们也需要对代码跑个分。这个时候，我们可以使用console.time和console.timeEnd，他们可以记录代码运行所花费的时间。

```js
console.time("神机妙算");
(function () {
    for(var i = 0; i < 10; i++) {
        var sum = (function () {
            var flog = 0;
            for(var i = 0; i < 10; i++) {
                flog+=i;
            }
        })();
    }
})();
console.timeEnd("神机妙算");
```

啊咧咧？你这个顶多就是 计时器 怎么能说是 性能测试 。客官别急，我们这还有一个叫做 console.profile 和 console.profileEnd 姐妹呢~~

```js
console.profile("神机妙算");
(function () {
    for(var i = 0; i < 10; i++) {
        var sum = (function () {
            var flog = 0;
            for(var i = 0; i < 10; i++) {
                flog+=i;
            }
        })();
    }
})();
console.profileEnd("神机妙算");
```

输出会显示在 profile

什么还是不够？你还想知道运行时的结果栈？可以可以，我们这还有一位 **console.trace** 哦。他可以看透大爷你的一局一动哦。 

代码：

```js
function add(num) {
    if (0 < num) {
        console.trace("现在num的值为", num);
        return num + add(num - 1);
    } else {
        return 0;
    }
}

var a =3;
add(3);
```

### 判断真假

平时我们在写代码是时候，经常需要判断一下当前值的真假情况，使用if或者三元表达式来达到目的。我们现在也可以使用 **console.assert** 来判断，该方法会在条件为错误时，返回一个 console.error 的输出。 

断言：

```js
console.assert(1 == 1);
console.assert(1 == 0);
console.assert(!(1 == 0));``
```

### 统计次数

有时候我们需要统计一个函数或者被调用了几次，我们通常会增加一个变量 count 来记录，然后在控制台中查看。这样相当的麻烦，我们可以使用 console.count 函数来帮忙我们记录次数，并输出。

```js
function hi(name) {
    console.count(name);
    return "hi " + name;
}

for(var i = 0; i < 10; i++) {
    if(i < 4) {
        hi("person");
    } else {
        hi("god");
    }
}
```

### debugger 语句

`debugger`语句主要用于除错，作用是设置断点。如果有正在运行的除错工具，程序运行到`debugger`语句时会自动停下。如果没有除错工具，`debugger`语句不会产生任何结果，JavaScript 引擎自动跳过这一句。

Chrome 浏览器中，当代码运行到`debugger`语句时，就会暂停运行，自动打开脚本源码界面。

```js
for(var i = 0; i < 5; i++){
  console.log(i);
  if (i === 2) debugger;
}
```

上面代码打印出0，1，2以后，就会暂停，自动打开源码界面，等待进一步处理。