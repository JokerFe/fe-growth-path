#  Promise

## 介绍

 **Promise**对象用于一个异步操作的最终完成（或失败）及其结果值的表示。（一个诺言，一个成功，一个失败。)
Promise 对象用于延迟(deferred) 计算和异步(asynchronous ) 计算。一个Promise对象代表着一个还未完成，但预期将来会完成的操作。 Promise 对象是一个返回值的代理，这个返回值在promise对象创建时未必已知。它允许你为异步操作的成功或失败指定处理方法。 这使得异步方法可以像同步方法那样返回值：异步方法会返回一个包含了原返回值的 promise 对象来替代原返回值。

## 语法

```
new Promise(
    /* executor */
    function(resolve, reject) {...}
);
```

## 参数:**executor**

executor是一个带有resolve和reject两个参数                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    的函数。executor 函数在Promise构造函数执行时同步执行，被传递resolve和reject函数（executor 函数在Promise构造函数返回新建对象前被调用）。resolve和reject函数被调用时，分别将promise的状态改为fulfilled(完成)或rejected（失败）。executor 内部通常会执行一些异步操作，一旦完成，可以调用resolve函数来将promise状态改成fulfilled，或者在发生错误时将它的状态改为rejected。

如果在executor函数中抛出一个错误，那么该promise 状态为rejected。executor函数的返回值被忽略。

## 描述

**Promise**对象是一个代理对象（代理一个值），被代理的值在Promise对象创建时可能是未知的。它允许你为异步操作的成功和失败分别绑定相应的处理方法（handlers ）。 这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的promise对象

一个Promise有以下几种状态:

- pending: 初始状态，不是成功或失败状态。
- fulfilled: 意味着操作成功完成。
- rejected: 意味着操作失败。

pending 状态的 Promise 对象可能触发fulfilled 状态并传递一个值给相应的状态处理方法，也可能触发失败状态（rejected）并传递失败信息。当其中任一种情况出现时，Promise 对象的 then 方法绑定的处理方法（handlers）就会被调用（then方法包含两个参数：onfulfilled 和 onrejected，它们都是 Function 类型。当Promise状态为fulfilled时，调用 then 的 onfulfilled 方法，当Promise状态为rejected时，调用 then 的 onrejected 方法， 所以在异步操作的完成和绑定处理方法之间不存在竞争）。

因为[Promise.prototype.then](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)和[Promise.prototype.catch](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)方法返回promise 对象， 所以它们可以被链式调用。

![img](http://upload-images.jianshu.io/upload_images/8024294-b5f04da4bf4ac465.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240)

> **不要被迷惑了：**有一些语言中有惰性求值和延时计算的特性, 它们也被称为"promises" --例如Scheme. Javascript中的promise代表一种已经发生的状态, 而且可以通过回调方法链在一起. 如果你想要的是表达式的延时计算, 考虑无参数的"[箭头方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)": f = () =>表达式创建惰性求值的表达式,使用**f()**求值.
>
> **注意：**如果一个promise对象处在fulfilled或rejected状态而不是pending状态，那么它也可以被称为settled状态。你可能也会听到一个术语resolved，它表示promise对象处于fulfilled状态。（此处有待商榷。按本文的原英文翻译resolved表示fulfilled，但是后面的术语链接又表明resolved和fulfilled并不是一样。）关于promise的术语， Domenic Denicola 的[States and fates](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md)有更多详情可供参考。

## 属性

Promise.length

长度属性，其值总是为 1 (构造器参数的数目).

[`Promise.prototype`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/prototype)

表示Promise构造器的原型.

## 方法

[`Promise.all(iterable)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

这个方法返回一个新的promise对象，该promise对象在iterable参数对象里所有的promise对象都成功的时候才会触发成功，一旦有任何一个iterable里面的promise对象失败则立即触发该promise对象的失败。这个新的promise对象在触发成功状态以后，会把一个包含iterable里所有promise返回值的数组作为成功回调的返回值，顺序跟iterable的顺序保持一致；如果这个新的promise对象触发了失败状态，它会把iterable里第一个触发失败的promise对象的错误信息作为它的失败错误信息。Promise.all方法常被用于处理多个promise对象的状态集合。（可以参考jQuery.when方法---译者注）

[`Promise.race(iterable)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)

当iterable参数里的任意一个子promise被成功或失败后，父promise马上也会用子promise的成功返回值或失败详情作为参数调用父promise绑定的相应句柄，并返回该promise对象。

[`Promise.reject(reason)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)

返回一个状态为失败的Promise对象，并将给定的失败信息传递给对应的处理方法

[`Promise.resolve(value)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)

返回一个状态由给定value决定的Promise对象。如果该值是一个Promise对象，则直接返回该对象；如果该值是thenable(即，带有then方法的对象)，返回的Promise对象的最终状态由then方法执行决定；否则的话(该value为空，基本类型或者不带then方法的对象),返回的Promise对象状态为fulfilled，并且将该value传递给对应的then方法。通常而言，如果你不知道一个值是否是Promise对象，使用Promise.resolve(value) 来返回一个Promise对象,这样就能将该value以Promise对象形式使用。

## Promise原型

**属性**

```
Promise.prototype.constructor
```

返回创建了实例原型的函数. 默认为[Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)函数.

**方法**

[`Promise.prototype.catch(onRejected)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)

添加一个否定(rejection) 回调到当前 promise, 返回一个新的promise。如果这个回调被调用，新 promise 将以它的返回值来resolve，否则如果当前promise 进入fulfilled状态，则以当前promise的肯定结果作为新promise的肯定结果.

[`Promise.prototype.then(onFulfilled, onRejected)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)

添加肯定和否定回调到当前 promise, 返回一个新的 promise, 将以回调的返回值 来resolve.

## 常用方法实现

#### 完整版 A+

```javascript
function myPromise(constructor){
    let self=this;
    self.status="pending" //定义状态改变前的初始状态
    self.value=undefined;//定义状态为resolved的时候的状态
    self.reason=undefined;//定义状态为rejected的时候的状态
    function resolve(value){
        //两个==="pending"，保证了状态的改变是不可逆的
       if(self.status==="pending"){
          self.value=value;
          self.status="resolved";
       }
    }
    function reject(reason){
        //两个==="pending"，保证了状态的改变是不可逆的
       if(self.status==="pending"){
          self.reason=reason;
          self.status="rejected";
       }
    }
    //捕获构造异常
    try{
       constructor(resolve,reject);
    }catch(e){
       reject(e);
    }
}
// then
myPromise.prototype.then=function(onFullfilled,onRejected){
   let self=this;
   switch(self.status){
      case "resolved":
        onFullfilled(self.value);
        break;
      case "rejected":
        onRejected(self.reason);
        break;
      default:       
   }
}
```

#### 大厂专用版

```javascript
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function Promise(excutor) {
    let that = this; // 缓存当前promise实例对象
    that.status = PENDING; // 初始状态
    that.value = undefined; // fulfilled状态时 返回的信息
    that.reason = undefined; // rejected状态时 拒绝的原因
    that.onFulfilledCallbacks = []; // 存储fulfilled状态对应的onFulfilled函数
    that.onRejectedCallbacks = []; // 存储rejected状态对应的onRejected函数

    function resolve(value) { // value成功态时接收的终值
        if(value instanceof Promise) {
            return value.then(resolve, reject);
        }
        // 实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
        setTimeout(() => {
            // 调用resolve 回调对应onFulfilled函数
            if (that.status === PENDING) {
                // 只能由pending状态 => fulfilled状态 (避免调用多次resolve reject)
                that.status = FULFILLED;
                that.value = value;
                that.onFulfilledCallbacks.forEach(cb => cb(that.value));
            }
        });
    }
    function reject(reason) { // reason失败态时接收的拒因
        setTimeout(() => {
            // 调用reject 回调对应onRejected函数
            if (that.status === PENDING) {
                // 只能由pending状态 => rejected状态 (避免调用多次resolve reject)
                that.status = REJECTED;
                that.reason = reason;
                that.onRejectedCallbacks.forEach(cb => cb(that.reason));
            }
        });
    }

    // 捕获在excutor执行器中抛出的异常
    // new Promise((resolve, reject) => {
    //     throw new Error('error in excutor')
    // })
    try {
        excutor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

// then
Promise.prototype.then = function(onFulfilled, onRejected) {
    const that = this;
    let newPromise;
    // 处理参数默认值 保证参数后续能够继续执行
    onFulfilled =
        typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected =
        typeof onRejected === "function" ? onRejected : reason => {
            throw reason;
        };
    if (that.status === FULFILLED) { // 成功态
        return newPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                try{
                    let x = onFulfilled(that.value);
                    resolvePromise(newPromise, x, resolve, reject); // 新的promise resolve 上一个onFulfilled的返回值
                } catch(e) {
                    reject(e); // 捕获前面onFulfilled中抛出的异常 then(onFulfilled, onRejected);
                }
            });
        })
    }

    if (that.status === REJECTED) { // 失败态
        return newPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onRejected(that.reason);
                    resolvePromise(newPromise, x, resolve, reject);
                } catch(e) {
                    reject(e);
                }
            });
        });
    }

    if (that.status === PENDING) { // 等待态
        // 当异步调用resolve/rejected时 将onFulfilled/onRejected收集暂存到集合中
        return newPromise = new Promise((resolve, reject) => {
            that.onFulfilledCallbacks.push((value) => {
                try {
                    let x = onFulfilled(value);
                    resolvePromise(newPromise, x, resolve, reject);
                } catch(e) {
                    reject(e);
                }
            });
            that.onRejectedCallbacks.push((reason) => {
                try {
                    let x = onRejected(reason);
                    resolvePromise(newPromise, x, resolve, reject);
                } catch(e) {
                    reject(e);
                }
            });
        });
    }
};


```

### Promise.all

##### 核心思路

① 接收一个 Promise 实例的数组或具有 Iterator 接口的对象作为参数

② 这个方法返回一个新的 promise 对象，

③ 遍历传入的参数，用Promise.resolve()将参数"包一层"，使其变成一个promise对象

④ 参数所有回调成功才是成功，返回值数组与参数顺序一致

⑤ 参数数组其中一个失败，则触发失败状态，第一个触发失败的 Promise 错误信息作为 Promise.all 的错误信息。

```js
Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            throw new Error('argument must be a array');
        }
        // 用来记录Promise成功的次数
        let resolveCount = 0,
            // 用来保存Promise成功的结果
            resolveDataList = [];
        for (let index = 0, len = promises.length; index < len; index++) {
            const p = promises[index];
            Promise.resolve(p).then(data => {
                resolveDataList[index] = data;
                // promise成功次数等于promises数组长度，则成功
                if (++resolveCount === len) {
                    resolve(resolveDataList);
                }
                // 有一个失败就失败
            }, reject);
        }
    });
}
```

#### Promise.race

```js
Promise.race = (promises = []) => {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            throw new TypeError(`argument must be a array`);
        }
        for (const p of promises) {
            // 有一个成功就返回成功状态的promise
            // 有一个失败就返回失败状态的promise
            p.then(resolve, reject);
        }
    });
}
```

#### Promise.prototype.finally

Promise.finally() 最终的，无论如何finally中传递的回调函数 必须会执行，如果返回一个promise,会等待这个Promise执行完成

```js
Promise.prototype.finally = function(callback){
    return this.then(res => {
        // 如果then方法返回一个Promise, 就会等待这个方法执行完毕，所以需要包装成Promise才能等待
        return Promise.resolve(callback()).then(() => res);
    }, err => {
        return Promise.resolve(callback()).then(() => {
            throw err;
        })
    });
}
```

#### Promise.allSettled

##### 使用方式

``` js
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function (results) {
  console.log(results);
});
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```

1. Promise.al1Settled() 方法接受一组 Promise 实例作为参数，返回一个新的 Promise 实例。
2. 只有等到所有这些参数实例都返回结果，不管是 fulfilled 还是 rejected，包装实例才会结束。
3. 返回的新 Promise 实例，一旦结束，状态总是 fulfilled，不会变成 rejected
4. 新的 Promise 实例给监听函数传递一个数组 resul七s。该数组的每个成员都是一个对象，对应传入 Promise.al1Settled 的 Promise 实例。每个对象都有 status 属性，对应着 fulfilled 和 rejected。 fulfilled 时，对象有 value 属性，rejected时有 reason 属性，对应两种状态的返回值。
5. 有时候我们不关心异步操作的结果，只关心这些操作有没有结束时，这个方法会比较有用。

##### 手写实现

```js
const formatSettledResult = (success, value) =>
  success
    ? { status: "fulfilled", value }
    : { status: "rejected", reason: value };

Promise.all_settled = function (iterators) {
  const promises = Array.from(iterators);
  const num = promises.length;
  const resultList = new Array(num);
  let resultNum = 0;

  return new Promise((resolve) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          resultList[index] = formatSettledResult(true, value);
          if (++resultNum === num) {
            resolve(resultList);
          }
        })
        .catch((error) => {
          resultList[index] = formatSettledResult(false, error);
          if (++resultNum === num) {
            resolve(resultList);
          }
        });
    });
  });
};

const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);
Promise.all_settled([resolved, rejected]).then((results) => {
  console.log(results);
});
```

