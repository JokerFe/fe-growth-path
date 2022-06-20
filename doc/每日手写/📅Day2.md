1.手写算法

#### [821. 字符的最短距离](https://leetcode.cn/problems/shortest-distance-to-a-character/)

```js
整数的 数组形式  num 是按照从左到右的顺序表示其数字的数组。

例如，对于 num = 1321 ，数组形式是 [1,3,2,1] 。
给定 num ，整数的 数组形式 ，和整数 k ，返回 整数 num + k 的 数组形式 。

示例 1：
输入：num = [1,2,0,0], k = 34
输出：[1,2,3,4]
解释：1200 + 34 = 1234

示例 2：
输入：num = [2,7,4], k = 181
输出：[4,5,5]
解释：274 + 181 = 455

示例 3：
输入：num = [2,1,5], k = 806
输出：[1,0,2,1]
解释：215 + 806 = 1021

提示：
1 <= num.length <= 104
0 <= num[i] <= 9
num 不包含任何前导零，除了零本身
1 <= k <= 104
```

#### 答案

```js
var shortestToChar = function(s, c) {
    const len = s.length;
    let res = [];
    let eIndex = -len;
    for(let i = 0;i<len;i++) {
        if (s[i] === c) {
            res.push(0);
            eIndex = i
        } else {
            res.push(i - eIndex)
        }
    }
    for(let i = len -1;i>=0;i--){
        if (s[i] === c) {
            eIndex = i
        } else {
             res[i] = Math.abs(Math.min(eIndex - i, res[i]))
        }
       
    }
    return res;
};
```



2.编程题
实现symbol polyfill
//题解：如果浏览器不支持情况下 写出让代码让浏览器支持symbol

