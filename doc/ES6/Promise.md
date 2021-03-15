# Promise

**Promise** 对象用于表示一个异步操作的最终完成 (或失败)及其结果值。在异步任务中属于微任务。它在被创建的时候不一定是已知的值，异步方法并不会立即返回最终的值，而是返回一个**promise**，它会在未来的某个时候将值返回给使用者。

它有三个状态：

1. `pending`：初始状态，promise的值还是未知的
2. `fulfilled`: 操作成功完成，对应的内部执行方法是`resolve`，调用的结果方法是`then`。
3. `rejected`：操作失败，对应内部执行的方法是`reject`，调用的结果方式是`catch`



## 常用方法实现

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

