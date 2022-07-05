#### 说出运行结果
```js
function fn() {
    console.log(1)
}
(function (fn) {
    fn()
    fn = function () {
        console.log(2)
    }
    function fn() {
        console.log(3)
    }
    fn()
    fn && fn()
    fn()
})(fn)  //3 2 2 2
```
#### 说出运行结果
```js
function a() {
    var i = 0 
    function b(){
        console.log(++i)
    }
    return b 
}
var c = a()
c()
c()
var d = a()
d()
d()  // 1 2 1 2 
```


#### 说出运行结果
```js
async function f1(){
    console.log(1)
    console.log(2)
    await Promise.resolve().then(() => console.log(3))
    console.log(4)
}
async function f2() {
    await console.log(8)
    await console.log(9)
    console.log(10)
}
console.log('start')
setTimeout(()=>console.log(11))
new Promise((resolve,reject)=>{
    console.log(12)
    resolve()
}).then(()=>console.log(13))
f1()
f2()
console.log('end')
```
#### 说出运行结果
```js
var name = 'the window'
var object = {
    name: 'my object',
    getNameFunc: function(){
        return this.name 
    }
}
console.log(object.getNameFunc())
const fn = object.getNameFunc
console.log(fn())
```
#### 手写防抖 手写节流
```js
function fangdou(fn,delay){
    let timeout = null
    return function(){
        clearTimeout(timeout)
        timeout = setTimeout(fn,delay)
    }
}
```
#### 两个有序数组排序（我就说出来2种方式）
```js
arr1.concat(arr2).sort(()=>1)
```
```js
function fn(arr1,arr2){
    arr1.forEach(val=>{
        for(let i = 0 ; i < arr2.length; i++)
        {
            if(val<=arr2[i]){
                arr2.splice(i,0,val)
                break
            }
        }
    })
    return arr2
}
```
#### 实现一个函数，将字符串内出现最少的字母祛除，如果有并列的就都祛除
#### 实现一个函数，字符串中哪些元素只出现1次
#### 详细说说 EVENT LOOP
#### CSS 实现垂直水平居中 
flex transform table(具体咋实现我没答上来)
#### PX EM REM 区别
#### 什么是设备物理像素
#### 啥是跨域 咋解决
JSONP缺点是啥，手写一个实现jsonp函数
#### 解释XSS和CSRF是啥？有什么联系？还知道其他的攻击方式吗？
#### 如何提升页面性能
懒加载 预加载 首页行内样式 少重流 webpack打包 请求 小于10K图片用base64 雪碧图 用缓存 越详细越好  
#### 什么是重流和重绘，那些属性会触发重流
transform box shadow fliter 之类
#### 什么是JS盒模型
就那个。。clientWidth offsetTop scrollWidth啊 啥的那一堆，没答全
#### 说说ES6 
#### 说说 ES7\8\9\10新增那些内容你比较感兴趣
#### 说说你理解的promise 错误如何捕获 和 async await的关系，以及async 怎么捕获错误
三种状态 不可更改 巴拉巴拉 网上一堆 
#### PROMISE 不返回值 后边的链式调用 会执行吗  之类的衍生问题 一堆
#### 手写实现一个PROMISE（鬼才能答上来
#### 写一个二分查找，递归和不递归的都写一下
#### 什么是逻辑结构什么是存储结构
#### JS 实现链表，JS实现二叉树
#### C语言如何存储字符串
用数组
#### 现代浏览器输入一个内容，到内容呈现的过程，（注意是现代浏览器，有可能是搜索,记得分浏览器进程来说，
#### HTTP2的优点是啥
#### HTTPS中的S 是啥
#### SSL或者TLS 加密方式是啥 这种加密方式有没有什么隐患
#### 说说常见的头部
#### 强缓存和协商缓存都是啥
#### 啥是 service worker
#### 自己实现一个 indexof 
#### JS如何实现继承（能说出来越多越好
#### JS隐式转换规则
#### 
# node webpack git的问题我统统答不上来！！！！
# VUE 和 REACT的问题我也统统答不上来！！！！


#### SB面试题
You would like to go on a trip to visit two cities (it is possible to visit the same city twice). The appeal of your trip is the attractiveness level of the visited cities increased by the distance between them (two neighboring cities are at a distance of 1 from each other). The goal is to find the trip with the highest possible level of appeal.

Write a function:

function solution(A);

that, given an array A consisting of N integers (A[K] denotes the attractiveness level of the K-th city), returns the highest possible appeal of your trip.

Examples:

1. Given A = [1, 3, −3] your function should return 6. There are six possible trips:

if you visit city 0 two times, then appeal of trip is A[0] + A[0] + (0 − 0) = 1 + 1 + 0 = 2,
if you visit city 1 two times, then appeal of trip is A[1] + A[1] + (1 − 1) = 3 + 3 + 0 = 6,
if you visit city 2 two times, then appeal of trip is A[2] + A[2] + (2 − 2) = (−3) + (−3) + 0 = −6,
if you visit cities 0 and 1, then appeal of trip is A[0] + A[1] + (1 − 0) = 1 + 3 + 1 = 5,
if you visit cities 0 and 2, then appeal of trip is A[0] + A[2] + (2 − 0) = 1 + (−3) + 2 = 0,
if you visit cities 1 and 2, then appeal of trip is A[1] + A[2] + (2 − 1) = 3 + (−3) + 1 = 1.
Visiting city 1 two times has the highest appeal equal to 6.

2. Given A = [−8, 4, 0, 5, −3, 6] your function should return 14, because you can visit cities 1 and 5. The attractiveness levels are: A[1] = 4, A[5] = 6 and the distance is 5 − 1 = 4. So, in total, the highest appeal of your trip is 4 + 6 + 4 = 14.

Write an efficient algorithm for the following assumptions:

N is an integer within the range [1..100,000];
each element of array A is an integer within the range [−1,000,000,000..1,000,000,000].

// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');
```
function solution(A) {
    // write your code in JavaScript (Node.js 8.9.4)
    const attractivenessLevel = (A, a, b) => A[a] + A[b] + b - a;
    
    let result = A[0] + A[0];
    
    for (let i = 0; i < A.length; i++) {
        for (let j = i; j < A.length; j++) {
            const temp = attractivenessLevel(A, i, j);
            if (temp > result) {
                result = temp;
            }
        }
    }
    
    return result;
}
```
We are given a string S representing a phone number, which we would like to reformat. String S consists of N characters: digits, spaces and/or dashes. It contains at least two digits.

Spaces and dashes in string S can be ignored. We want to reformat the given phone number in such a way that the digits are grouped in blocks of length three, separated by single dashes. If necessary, the final block or the last two blocks can be of length two.

For example, given string S = "00-44  48 5555 8361", we would like to format it as "004-448-555-583-61".

Write a function:

function solution(S);

that, given a string S representing a phone number, returns this phone number reformatted as described above.

For example, given S = "00-44  48 5555 8361", the function should return "004-448-555-583-61". Given S = "0 - 22 1985--324", the function should return "022-198-53-24". Given S = "555372654", the function should return "555-372-654".

Assume that:

N is an integer within the range [2..100];
string S consists only of digits (0−9), spaces and/or dashes (-);
string S contains at least two digits.
In your solution, focus on correctness. The performance of your solution will not be the focus of the assessment.

// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');
```
function solution(S) {
    // write your code in JavaScript (Node.js 8.9.4)
    return S.replace(/[^\d]/g, '').match(/((\d{3}|\d{2})(?=\d{2,})|\d{2,}$)/g).join('-');
}
```
You are given an implementation of a function:

function solution(M, A);

that, given an integer M and an array A consisting of N non-negative integers, which are not greater than M, returns the value (or one of the values) that occurs most often in this array.

For example, given M = 3 and array A such that:

  A[0] = 1
  A[1] = 2
  A[2] = 3
  A[3] = 3
  A[4] = 1
  A[5] = 3
  A[6] = 1
the function may return 1 or 3.

The attached code is still incorrect on some inputs. Despite the error(s), the code may produce a correct answer for the example test cases. The goal of the exercise is to find and fix the bug(s) in the implementation. You can modify at most four lines.

Assume that:

N is an integer within the range [1..200,000];
M is an integer within the range [1..10,000];
each element of array A is an integer within the range [0..M].
In your solution, focus on correctness. The performance of your solution will not be the focus of the assessment.

Copyright 2009–2019 by Codility Limited. All Rights Reserved. Unauthorized copying, publication or disclosure prohibited.
```
function solution(M, A) {
    var N = A.length;
    var count = new Array(M + 1);
    var i;
    for (i = 0; i <= M; i++)
        count[i] = 0;
    var maxOccurence = 1;   //改成0
    var index = -1;         //改成0     
    for (i = 0; i < N; i++) {
        if (count[A[i]] > 0) {
            var tmp = count[A[i]];
            if (tmp > maxOccurence) {
                maxOccurence = tmp;
                index = i;
            }
            count[A[i]] = tmp + 1;
        } else {
            count[A[i]] = 1;
        }
    }
    return A[index];
}
```