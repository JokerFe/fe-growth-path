# 剑指offer-JavaScript

## 二维数组的查找

**题目描述**：

在一个二维数组中（每个一维数组的长度相同），每一行都按照从左到右递增的顺序排列，每一列都按照从上到下递增的顺序排列，请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否有该整数。

**思路**：

选择最左下角的那个点作为起始点，也就是a\[array.length][0]，比它大就走右边走col++，比它小就往上面走row--。

```js
function Find(target,array){
  const n = array.length;
  const m = array[0].length;
  let row = n -1;
  let col = 0;
  while(row >= 0 && col <= m-1){
        if(target < array[row][col]){
          row--
        }else if(target > array[row][col]){
          col++
        }else{
          return true
        }
    }
}
```

## 替换空格

**题目描述**：

请实现一个函数，将一个字符串中的每个空格替换成“%20”，例如，当字符串为We Are Happy,则经过替换之后的字符串为We%20Are%20Happy。

**思路**：

使用正则表达式。

```js
function replaceSpace(str){
  return str.replace(/\s/,'%20')
}
// \s代表正则匹配字符串中的空字符，‘g’代表全部匹配
```

## 输入一个链表，按链表值从尾到头的顺序返回一个ArrayList。

**思路**：

把链表值全部装入数组中，再对数组进行reverse，链表的head通过.val取值，通过.next获取下一个值

```js
function printListFromTailToHead(head){
  var arr = [];
  while(head!=null){
        arr.push(head.val);
    		head = head.next;
    }
  return arr.reverse();
}
```

## 重建二叉树

**题目描述**：

输入某二叉树的前序遍历和中序遍历的结果，请重建出该二叉树，假设输入的前序遍历和中序遍历的结果中都不含重复的数字，例如输入前序遍历序列{1,2,4,7,3,5,6,8}和中序遍历序列{4,7,2,1,5,3,8,6}，则重建二叉树并返回

**思路**：

前序遍历是先遍历根，所以先找出根节点，再分出左右子树，递归左右子树的前序，中序。

```js
function reConstructBinaryTree(pre,vin){
  //前序的根节点为第一个，通过pre[0]找到中序中根节点的位置，区分左右树。
  if(pre.length == 0 || vin.length == 0)
    return null;
  var index = vin.indexOf(pre[0]);
  var left = vin.slice(0,index);//中序左子树
  var right = vin.slice(index+1);//中序右子树
  //slice方法在只有一个参数的情况下，该方法返回从该参数指定位置到当前数组末尾的所有项。
  console.log(pre[0]);
  return {
    val:pre[0],
    //递归左右子树的前序，中序
    left:reConstructBinaryTree(pre.slice(1,index+1),left),
    right:reConstructBinaryTree(pre.slice(index+1),right)
  }
}
var preList = [1,2,4,7,3,5,6,8];
var vinList = [4,7,2,1,5,3,8,6];
reConstructBinaryTree(preList,vinList)
```

## 用两个栈实现队列

**题目描述**：

用两个栈实现一个队列，完成队列的PushPop操作，队列的元素为int类型。

**注意**：

队列是先进先出，因此两个栈，一个用来push，一个用来pop（shift是移除数组中的第一个元素）

```js
const stack = [];
function push(node){
  stack.push(node);
}
function pop(){
  return stack.shift();
}
```

## 旋转数组的最小数字

**题目描述**：

把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转，输入一个非减排序的数组的一个旋转，输出旋转数组的最小元素。例如数组[3,4,5,1,2]为[1,2,3,4,5]的一个旋转，该数组的最小值为1。NOTE：给出的所有元素都大于0，若数组大小为0，返回0.

**思路**：

用排序的方法来做，sort()方法返回值大于1就将b排到a的前面，注意是输出元素的最小值而不是数组。

```js
function minNumberINRotateArray(rotateArray){
  {
    // write code here
    rotateArray.sort(function(a,b){
        if(a<b) return -1;
        else return 1;
    });
    return rotateArray[0];
	}
}
```

## 斐波拉契数列

**题目描述**：

要求输入一个整数n，请你输出斐波拉契数列的第n项（从0开始，第0项为0）。n<=39

**思路**：

先写终止条件，再写递归条件

```js
function Fibonacci(n){
  if(n == 0)
    return 0;
  var f = [];
  f[1] = 1;
  f[2] = 1;
  for(var i=3;i<=n;i++){
    f[i] = f[i-1]+f[i-2];
  }
  return f[n];
}
```

## 跳台阶

**题目描述**：

一只青蛙一次可以跳上1级台阶，也可以跳上2级。求该青蛙跳上一个n级的台阶总共有多少种跳法（先后次序不同算不同的结果）。

**思路**：

仔细分析一下也能看出这是一个斐波拉契数列,所以可以得出总跳法为: f(n) = f(n-1) + f(n-2)，同样采用上一个的方法。

```js
function jumpFloor(number){
   if(number == 1)
       return 1;
    if(number == 2)
        return 2;
    var f = [];
        f[1] = 1;
        f[2] = 2;
    for(var i=3;i<=number;i++){
     f[i] = f[i-1]+f[i-2];
    }
    return f[number];
}
```

## 变态跳台阶

**题目描述**：

一只青蛙一次可以跳上1级台阶，也可以跳上2级……它也可以跳上n级。求该青蛙跳上一个n级的台阶总共有多少种跳法。

```js
function jumpFloorII(number)
{
    if(number<=1){
        return 1;
    }
    return 2*jumpFloorII(number-1);
}
```

## 矩形覆盖

**题目描述**：

我们可以用2* 1的小矩形横着或者竖着去覆盖更大的矩形。请问用n个2* 1的小矩形无重叠地覆盖一个2*n的大矩形，总共有多少种方法？

**思路**：

又是类似于斐波那契数列，所以代码几乎一样，终止条件+递归

```js
function rectCover(number) {
   if(number == 0) return 0;
    var f =[];
        f[1]=1;
        f[2]=2;
    for(var i=3;i <= number;i++){
        f[i]=f[i-1]+f[i-2];
    }
    return f[number];
}
```

## 二进制中1的个数

**题目描述**：

输入一个整数，输出该数二进制表示中1的个数。其中负数用补码表示。

**思路**：

把一个整数减去1，再和原来的整数做与运算。这样就会让1的位置变换，那么一个整数的二进制表示中有多少个1，就可以进行多少次这样的操作。count用来计数。

```js
function NumberOf1(n){
    let count = 0;
    while (n!=0){
        n=n&(n-1);
        count++;
    }
    return count;
}
```

## 最大连续1的个数

**题目描述**：

给定一个二进制数组， 计算其中最大连续1的个数。

**思路**：

时间按复杂度：O(n)

设置一个计数变量 count，来计数连续出现的 1，max用来存不同组1的连续量。

从头到尾遍历，若为 1，count++，若为0，求max与count的最大值，count变为0.

```js
var findMaxConsecutiveOnes = function(nums) {
  var max = 0,
      count = 0;
  for (var i in nums) {
    if (nums[i] === 1) {
      count++;
    } else {
      max = Math.max(count, max);
      count = 0;
    }
  }
  max = Math.max(count, max);  // 最后一连串的 1 有可能是最长的
  return max;
};
```

## 查找两个字符串中最大的公共子串

**思路**：

用动态规划来解

![动态规划](https://user-gold-cdn.xitu.io/2019/8/21/16cb4802e5b83079?imageslim)

化成一个二维数组，分解成单个的字符去匹配每个单个的字符，只要相同的值就相比前一个+1，不相同设为0；要知道起始位置和字串的长度。从图中可以看到的红字就是存放这个位置的最优解字串的长度，所以应该建立两个变量去存储其实位置的index 和最大长度 max。

```js
function find(str1,str2){
  //创建一个二维数组
  let temp = new Array();
  let max = 0;
  let index = null;
  for(let i =0;i<str1.length;i++){
    //初始化为二维数组
    temp[i] = new Array();
    for(let j = 0;j<str2.length;j++){
      //比较两个位置的值是否相等，相等就让temp[i][j]相对于temp[i-1][j-1]加一（前提是temp[i-1][j-1]存在）
      if(str1.charAt(i) === str2.charAt(j)){
        if(i>0&&j>0&&temp[i-1][j-1]>0){
          temp[i][j] = 1 + temp[i-1][j-1]
        }else{
          temp[i][j] = 1
        }
        //保存当前temp中最大的数字，并找到index下标
        if(max<temp[i][j]){
          max = temp[i][j]
          index = i
        }
      }else{
        temp[i][j] = 0
      }
    }
  }
  console.log("max="+max)
  console.log("index="+index)
  console.log(temp)
  console.log(str2.substr(index-1,max)) 
  //substr(开始提取字符的位置,length提取的字符数)
}
find("aaabbb","eaebaaabbb2")
```

## 找出无序数组中的最长连续序列的长度

方法一：

**思路**：

先排序，排序之后，通过比较前后元素是否相差 1 来判断是否连续。即arr[i]+1==arr[i+1]

方法二：

**思路**：

用类似于 hashmap 这样的数据结构优化查询部分，将时间复杂度降低到 O(1)，用Hash把数据整理过之后。就要找连续序列了。 对于一个数，看它相邻的数在不在hash里，要比看hash里的数是否相邻，即，看到一个数，就尝试对其左右扩张，看是否在数组中。

```js
var longestConsecutive = function(nums) {
  nums = new Set(nums);
  let max = 0;
  let y = 0;
  nums.forEach(x => {
    // 说明x是连续序列的开头元素
    if (!nums.has(x - 1)) {
      y = x + 1;
      while (nums.has(y)) {
        y = y + 1;
      }
      max = Math.max(max, y - x); // y - x 就是从x开始到最后有多少连续的数字
    }
  });
  return max;
};
```

## 洗牌算法 100个格子，10个雷，怎么实现每个格子有雷的概率都是1/10算法

**思路**：

在每次迭代时交换这个被取出的数字到原始列表的最后

1. 初始化原始数组和新数组，原始数组长度为n(已知)；

2. 从还没处理的数组（假如还剩k个）中，随机产生一个[0, k)之间的数字p（假设数组从0开始）；

3. 从剩下的k个数中把第随机数的位置取出；

4. 重复步骤2和3直到数字全部取完；

5. 从步骤3取出的数字序列便是一个打乱了的数列。

下面证明其随机性，即每个元素被放置在新数组中的第i个位置是1/n（假设数组大小是n）

```js
Array.prototype.shuffle = function() {
    var input = this;
    for (var i = input.length-1; i >=0; i--) {
        var randomIndex = Math.floor(Math.random()*(i+1));
        var itemAtIndex = input[randomIndex];
        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}
```

## 二叉树遍历 递归&非递归

**递归**

前序：其实就是根据根左右的顺序，将根打印出来，再一次递归左右

```js
var preOrderRecur = function(node) {
  if(!node) {
    return
  }
  console.log(node.value)
  preOrderRecur(node.left)
  preOrderRecur(node.right)
}
```

中序：按照左根右的顺序，打印出根

```js
var inOrderRecur = function(node) {
  if(!node) {
    return
  }
  inOrderRecur(node.left)
  console.log(node.value)
  inOrderRecur(node.right)
}
```

后序：左右根

```js
var postOrderRecur = function(node) {
  if(!node) {
    return
  }
  posOrderRecur(node.left)
  posOrderRecur(node.right)
  console.log(node.value)
}
```

**非递归：可用栈的方式去模拟**

**前序**：

用数组来模拟栈，首先判断根是否为空，将根节点入栈

1. 若栈为空，则退出循环

2. 栈不为空，将栈顶元素弹出

3. 如果弹出的节点的右节点不为空则将右节点**入栈**，同理再判断左节点

4. 这个地方先push右节点再push左节点是因为取出来的顺序相反

```js
var preOrderUnRecur = function(node) {
  if(node) {
    var stack = []
    stack.push(node)
    while(stack.length !== 0) {
      node = stack.pop()
      console.log(node.value)
      if(node.right) {
        stack.push(node.right)
      }
      if(node.left) {
        stack.push(node.left)
      }
    }
  }
}
```

**中序**：

左根右 先把左边的全部push进栈里再取出，然后再处理右边的。

```js
var inOrderUnRecur = function(node) {
  if(node) {
    var stack = []
    while(stack.length !== 0 || node) {
      if(node) {
        stack.push(node)
        node = node.left
      } else {
        node = stack.pop()
        console.log(node.value)
        node = node.right
      }
    }
  }
}
```

**后序**：

使用两个栈 这里使用了一个新的数组记录上次入栈/出栈的节点。思路是先把根节点和左树推入栈，然后取出左树，再推入右树，取出，最后取根节点。

```js
var postOrderUnRecur1 = function(node) {
  if(node) {
    var s1 = []
    var s2 = []
    s1.push(node)
    while(s1.length !== 0) {
      node = s1.pop()
      s2.push(node)
      if(node.left) {
        s1.push(node.left)
      }
      if(node.right) {
        s1.push(node.right)
      }
    }
    while(s2.length !== 0) {
      console.log(s2.pop().value);
    }
  }
}
```

## 二叉树中和为某一值的路径

**思路**：

前序遍历二叉树，当访问到某一结点时，把该结点添加到路径上，并累加当前结点的值。如果当前结点为叶结点并且当前路径的和刚好等于输入的整数，则当前的路径符合要求，把当前路径保存在result结果中；如果当前结点不是叶结点，弹出此结点。

```js
function FindPath(root, expectNumber) {
    var result = [];
    if (root === null) {
        return result;
    }
    dfsFind(root, expectNumber, [], 0, result);
    return result; 

}
function dfsFind(root, expectNumber, path, currentSum, result) {
    currentSum += root.val;

    path.push(root.val);

    if (currentSum == expectNumber && root.left == null && root.right == null) {
        result.push(path.slice(0)); 
    }
    if (root.left != null) {
        dfsFind(root.left, expectNumber, path, currentSum, result);
    }

    if (root.right != null) {
        dfsFind(root.right, expectNumber, path, currentSum, result);
    }

    path.pop();
}
```

## 反转链表

**解法一：迭代**

首先判断是否为空或者只有一个节点，是的话就不用反转，

设置两个指针，p 和 q，p指向head.next，q指向head.next.next。然后声明temp做交换的临时指针，然后就交换指针来反转

```js
var reverseList = function(head) {
  if (head === null || head.next === null) {  
  // 链表为空或只有一个节点时，不用反转
    return head;
  }
  var p = head.next;
  head.next = null;    // 让原本的head变为尾节点
  var temp;    // 临时指针
  while (p !== null) {
    temp = p.next;
    p.next = head;
    head = p;
    p = temp;
  }
  return head;
};
```

**另！！！如果是双向链表的话就多加一句**

```js
head.last = next
```

**解法二：递归**：

递归的方法就是不断调用自身函数，函数返回的是原链表的尾节点=新链表的头节点。新链表的尾节点指向null。

```js
var reverseList = function(head) {
  if (head === null || head.next === null) {
    return head;
  }
  var new_head = reverseList(head.next);  // 反转后的头节点
  head.next.next = head;                 
  // 将反转后的链表的尾节点与当前节点相连
  head.next = null;
  return new_head;
};
```

## 背包问题&动态规划

就是有i个物品，容量为j的背包，怎么放最优。如果第i个物品不放，那么问题就变成了V\[i-1][j],如果第i个物品放，那么问题就变成了V\[i-1][j-weight[i]]。

而且如果MAX的取值是前者（也就是不放更优），也就是说v[i][j]的最优解是由V\[i-1][j]演变而来的，那么则一定有V\[i-1][j]也是最优解。

公式：

```js
V[i, j] = max(V[i-1, j-w(i)] + v(i)，V[i-1,j])
```

其实已经是对“所有”方案进行了比对，选了一个最优的。所以我们可以用表来记录下这些子问题的解，来避免重复计算。动态规划dp能解决的问题还有一个特性，就是最优子结构， 最优子结构的意思是一个问题的最优解方案必然是由它的子问题的最优解方案构成的（或者说演变而成的）。

## 堆

堆总是一棵完全二叉树

为什么要为完全二叉树呢？我们知道完全二叉树除最后一层外，其它层的节点个数都是满的，最后一层节点都靠左排列

最大堆就是每个节点的值都>=其左右孩子（如果有的话）值的完全二叉树。最小堆便是每个节点的值都<=其左右孩子值的完全二叉树。

**创建堆**： 

**方法1：插入法**：

从空堆开始，依次插入每一个结点，直到所有的结点全部插入到堆为止。

时间：O(n*log(n))

**方法2：调整法**：

将这n个元素先顺序放入一个二叉树中形成一个完全二叉树，然后来调整各个结点的位置来满足最大/小堆的特性。找到最后一个结点，从它的父节点开始调整。根据性质，小的数字往上移动，大的往下沉；然后递归完成。

时间：O(n)

**最大堆的插入**

由于需要维持完全二叉树的形态，需要先将要插入的结点x放在最底层的最右边，插入后满 足完全二叉树的特点；然后把x依次向上调整到合适位置满足堆的性质

时间：O(logn)。

“结点上浮”

**删除**:当删除节点的数值时

如要删除72,先用堆中最后一个元素来替换72,再将这个元素下沉到合适位置,最后将叶子节点删除。

   “结点下沉”