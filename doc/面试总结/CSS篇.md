[toc]

## flex布局

父属性

1. flex-direction   主轴方向 row | row-reverse | column | column-reverse;
2. flex-wrap  是否换行  nowrap | wrap | wrap-reverse 
3. flex-flow  前两个属性的缩写
4. justify-content 主轴方向对齐方式 flex-start|flex-end|center|space-between|space-around 
   	space-between：两端对齐，项目之间的间隔都相等。
   		space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。
5. align-items 交叉轴方向对齐方式 flex-start|flex-end|center|baseline|stretch
   	baseline: 项目的第一行文字的基线对齐。
   		stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。
6. align-content 多条轴线对齐方式 flex-start|flex-end|center|space-between|space-around|stretch
   	space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
   		space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
   		stretch（默认值）：轴线占满整个交叉轴。

子属性

1. order 排序方式 越小越靠前
2. flex-grow 放大比例 默认0
3. flex-shrink 缩小比例 0 
4. flex-basis 占据的主轴空间
5. flex 表示占比  flex-grow | flex-shrink | flex-basis缩写
6. aligh-self 自己的排列方式 auto | flex-start | flex-end | center | baseline | stretch

## position

- static：默认值。没有定位，出现在正常流中
- inherit：继承父元素的值
- relative：相对定位，相对于自身
- absolute：绝对定位，相对于离他最近的已定位的父元素，脱离常规文档流
- fixed：相对于浏览器窗口进行定位，与absolute类似
- sticky：粘性定位，设置四个阈值，当他出现时随页面滚动，当到达指定值时，固定位置。场景：实现导航栏的固定

## 盒模型

IE盒模型

- 宽高是内容(content)+填充(padding)+边框(border)的总宽高
- box-sizing:border-box;

标准盒模型

- 宽高只是内容的宽高
- box-sizing:content-box;  

> 子元素的位置从父元素的内边距开始计算

## 移动端0.5px问题

> 多倍的设计图设计了1px的边框，在手机上缩小呈现时，由于css最低只支持显示1px大小，导致边框太粗的效果。

伪类

```css
.div-small:after {
	content: "";
  display: block;
  position: absolute;
  left: -50%;
  width: 200%;
  height: 1px;
  background: red;
  transform: scale(0.5);
}
```

devicePixelRatio

```js
var viewport = document.querySelector("meta[name=viewport]");
if (window.devicePixelRatio == 1) {  
  viewport.setAttribute('content', 'width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no');  
}  
if (window.devicePixelRatio == 2) {  
  viewport.setAttribute('content', 'width=device-width,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no');  
}  
if (window.devicePixelRatio == 3) {  
  viewport.setAttribute('content', 'width=device-width,initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no');  
}  
var docEl = document.documentElement;
var fontsize = 32* (docEl.clientWidth / 750) + 'px';
docEl.style.fontSize = fontsize;
```

阴影

```css
div{
    -webkit-box-shadow:0 1px 1px -1px rgba(0, 0, 0, 0.5);
}
```

## 等高

html

- 主盒子包裹左中右三个盒子，中间盒子添加内容

css

- 主盒子设置overflow:hidden
- 三个盒子设置
  - 左浮动
  - padding-bottom:9999px
  - margin-bottom:-9999px
- 让内容撑高度

```css
<div class="container">
	<div class="left">left</div>
	<div class="centerWrap">
    <div class="center">center</div>
  </div>
	<div class="right">right</div>
</div>

.container {
  overflow: hidden;
}
.left,
.right,
.centerWrap {
  float: left;
  padding-bottom: 9999px;
  margin-bottom: -9999px;
  background-color: yellow;
}
.centerWrap {
  width: 50vw;
}
.center {
  margin: 0 20px;
  height: 600px;
  background-color: salmon;
}
.left,
.right {
  width: 25vw;
  background-color: green;
}
```

## 宽高等比

vw 实现

- width:100vw height:75vw

padding 百分比 相对于屏幕窗口

```css
.wl-fa{
	position: relative;
	width: 100%;
	padding-bottom: 50%;
	background-color: yellowgreen;
	box-sizing: border-box;
}
.wl-ch{
	position: absolute;
	left: 0;
	top: 0;
}
```

## 多列

flex布局

双飞翼

- 主内容用box包裹 设置主内容左右边距 给左右留空间 左 margin-left:-100%  右 float：right margin-left:-width

圣杯

- 父容器设置margin 左右给left和right容器留位置，然后left左边距-100%，然后通过position:relative ,left容器宽度设置  右侧容器margin-left:容器宽度，然后用right 负宽度

## 实现 DIV 宽度自适应，宽高保持等比缩放

### 1.1 使用ww

```css
.square {
  width: 30%;
  height: 30vw;
  background: red;
}
```

ww 相对于视窗的宽度
**优点**：简洁方便
**缺点**：需要注意兼容问题

### 1.2 使用 padding 来实现

由于 margin, padding 的百分比数值是相对父元素的宽度计算的，只需将元素垂直方向的一个 padding 值设定为与 width 相同的百分比就可以制作出自适应正方形了。
但要注意，仅仅设置 padding-bottom 是不够的，若向容器添加内容，内容会占据一定高度，为了解决这个问题，需要设置` height: 0`。

```css
.square {
  width: 30%;
  height: 0;
  padding-bottom: 30%;
  background: red;
  /* 这样max-height就失效了 */
  /* max-height: 100px */
}
```

**优点**：简洁明了，兼容性好
**缺点**：会导致在元素设置上的 `max-height` 属性失效(`max-height` 不收缩）

### 1.3 利用伪元素的 margin(padding)-top 撑开容器

max-height 属性失效的原因是：max-height 属性只限制于 height， 也就是只会对元素的 content height 起作用。
解决方法是：用一个子元素撑开 content 部分的高度，从而使 max-height 属性生效。
首先需要设置伪元素，其内容为空，margin-top 设置为 100%。
但要注意，若使用垂直方向上的 margin 撑开父元素，仅仅设置伪元素是不够的，这涉及到 margin collapse 外边距合并的概念，由于容器与伪元素在垂直方向发生了外边距合并，所以撑开父元素高度并没有出现，解决方法是在父元素上触发 BFC：设置 `overflows:hidden`。

```css
.square {
  width: 30%;
  overflow: hidden;
  background: red;
  /* 这样max-height就生效了 */
  /* max-height: 100px */
}
.square:after {
  content: "";
  display: block;
  margin-top: 100%;
}
```

若使用垂直方向上的 padding 撑开父元素，则不需要触发 BFC。子元素的 100%就相当于父元素的30%

```css
.square {
  width: 30%;
  overflow: hidden;
  background: red;
  /* 这样max-height就生效了 */
  /* max-height: 100px */
}
.square:after {
  content: "";
  display: block;
  padding-top: 100%;
}
```

## 实现多列等高布局，元素实际占用的高度以多列中较高的为准

### 2.1 Flex布局

`flex-direction` 属性定义的主轴方向，默认值为row，水平展示。aligm-item 属性定义子项在 flex 容器的当前行的侧轴方向的对齐方式，默认为 stretch，元素被拉伸以适应容器。

```css
  <style>
        html,
        body,
        p {
            padding: 0;
            margin: 0;
        }
        .wrap {
            display: flex;
        }
        .item {
            width: 0;
          	flex:1;
            margin-right: 5px;
            background-color: brown;
        }
    </style>
	<div class="wrap">
        <div class="item">left</div>
        <div class="item">
            <p>center</p>
            <p>center</p>
            <p>center</p>
            <p>center</p>
            <p>center</p>
            <p>center</p>
        </div>
        <div class="item">right</div>
    </div>
```

### 2.2 table-cell布局

Table布局具有天然等高特性

```css
<style>
    html,body,p{
        margin:0;
        padding:0;
    }
    .wrap{
        width:100%;
        display: table;
        background-color: darkgrey;
        table-layout:fixed;
    }
    .left,.centerWrap,.right{
        display: table-cell;
    }
    .left,.right,.center{
        background-color: brown;
    }
    .center{
        margin: 0 10px;
    }
    </style>
    <div class="wrap">
        <div class="left">left</div>
        <div class="centerWrap">
            <div class="center">
                <p>center</p>
                <p>center</p>
                <p>center</p>
                <p>center</p>
                <p>center</p>
                <p>center</p>
            </div>
        </div>
        <div class="right">right</div>
    </div>
```

### 2.3假等高布局，内外边距底部正负值

设置父容器的 `overflow : hidden`，给每列设置比较大的底内边距 `padding-bottom`,然后用数值相似的负外边距消除这个高度 `margin-bottom`

```css
<style>
        html,body,p {
            padding: 0;
            margin: 0;
        }
        .wrap {
            overflow: hidden;
            background-color: darkgray;
        }
        .left,.centerWrap,.right {
            float: left;
            width: 33.3%;
            padding-bottom: 9999px;
            margin-bottom: -9999px;
        }
        .left,.center,.right{
            background-color:brown;
        }
        .center{
            margin: 0 10px;
        }
    </style>
	<div class="wrap">
        <div class="left">left</div>
        <div class="centerWrap">
            <div class="center">
                <p>center</p>
                <p>center</p>
                <p>center</p>
                <p>center</p>
                <p>center</p>
                <p>center</p>
                <p>center</p>
            </div>
        </div>
        <div class="right">right</div>
    </div>
```

### 2.4 grid布局

`grid-template-columns`设置列宽，`grid-auto-flow`自动布局算法，设置优先填充列

```css
<style>
        html,
        body,
        p {
            margin: 0;
            padding: 0;
        }

        .wrap {
            display: grid;
            grid-template-columns: 33.3% 33.3% 33.3%;
            grid-auto-flow: column;
            grid-gap: 10px;
            background-color: grey;
        }

        .item {
            background-color: brown;
        }
    </style>
    <div class="wrap">
        <div class="item">left</div>
        <div class="item">
            <p>center</p>
            <p>center</p>
            <p>center</p>
            <p>center</p>
            <p>center</p>
        </div>
        <div class="item">right</div>
    </div>
```

## 清除浮动

- 在父元素的最后添加一个div元素，添加样式 clear:both;

- 给父级元素添加伪类选择器 :after{display:block;clear:both;content:””;visibility:hidden;height:0}

- 将父元素变为BFC模型，因为BFC能让内部浮动元素参与计算，这样父元素的高就与内部元素等高。方法：float不为none；position为absolute或fixed；overflow不为visibility；display为inline-block、table-cell、flex等。

- BFC 是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。

- IFC 内联格式化上下文， 线框的高度有其包含行内元素中最高的实际高度计算而来的，不受垂直方向margin、paddind影响。

## BFC、IFC、FFC、GFC

BFC

它是页面上的一个隔离的独立容器，容器内的子元素不会影响到外面的元素。

生成BFC的五种情况

- 根元素
- float不为none
- position为absolute和fixed
- overflow不为visible
- display为inline-block、flex、table-cell等

IFC

内联格式上下文

高度由其包含行内元素中最高实际高度计算而来，不受到竖直方向的padding和margin的影响

FFC

自适应格式上下文

display为flex或inline-flex

GFC

网格布局格式上下文

## link和@import区别

从属关系

@import是css提供的语法规则，只能导入样式表；link是html提供的标签，不仅可以加载css文件，还可以定义RSS、rel链接属性等。

加载顺序

link标签引入的css被同时加载，@import引入的css将在页面加载完成后被加载

DOM可控性

可通过js操作dom，插入link标签来改变样式；由于DOM方法是基于文档的，无法使用@import的方式插入样式。

兼容性

@import是css2.1才有的语法，故只能在IE5+才能识别；link是HTMl元素，不存在兼容性问题。

同时存在

@import的加载顺序是后加载的，但是它加载完毕后会被置于样式表顶部，最终渲染是会被下面重名样式层叠。

## jpg、gif、png

gif 

gif 图形交换格式，索引颜色格式，颜色少的情况下，产生的文件极小，支持背景透明，动画，图形渐进，无损压缩（适合线条，图标等），缺点只有 256 种颜色

jpg 

jpg 支持上百万种颜色，有损压缩，压缩比可达 180：1，而且质量受损不明显，不支持图形渐进与背景透明，不支持动画

png 

png 为替代 gif 产生的，位图文件，支持透明，半透明，不透明。不支持动画，无损图像格式。Png8 简单说是静态 gif，也只有 256 色，png24 不透明，但不止 256 色。

## 动画

- transform
  - 转换
  - 旋转
  - 缩放

- transition
  - 过渡

- animation + @keyframes
  - 动画

## 实现动画方式

cSs3新增了transition与animation 两种方式可实现动画，那么在出现transition与animation之前，有两种方式实现动画：一种是使用css的hover伪类属性方式，另外一种是使用js改变css属性方式；

### hover 实现动画

```css
.div{
    width:100px;
    height:100px;
    background:red;
}
.div:hover{
    width:100px;
    height:100px;
    background:yellow;
}
```

但是这样有个问题，就是元素的状态是立即发生变化，没有一个过渡的过程，Css3 新增的transition 就很好的解决了这个问题。

### transition

```css
.div{
    width:100px;
    height:100px;
    background:red;
    /* 添加过渡 */
    transition: 1s;
}
.div:hover{
    width:100px;
    height:100px;
    background:yellow;
}
```

这样元素的变化就有了一个过渡的过程。

##### 语法

> transition: property duration timing-function delay;

* `property`:规定设置过渡效果的 CSS 属性的名称
* `duration`:规定完成过渡效果需要多少秒或毫秒
* `timing-function`:规定速度效果的速度曲线
* `delay`:定义过渡效果何时开始

上边的代码中没有设置 property，见默认所有发生变化的状态都会应用过渡，如果只需要某个特定属性发生过渡变化，写明就可以了。
如果多个属性可以用逗号隔开

```css
.div{
    width:100px;
    height:100px;
    background:red;
    /* 多个过渡 */
    transition: background 1s,width 2s,height 3s;
}
.div:hover{
    width:200px;
    height:200px;
    background:yellow;
}
```

### animation

除了transition 还有一个animation,比ttransition 更加强大
看一下使用方式，同样是实现上边的效果

```css
.div{
    width:100px;
    height:100px;
    background:red;
}
.div:hover{
    animation:div-ani 1s linear;
}
@keyframes div-ani{
    100%{
        width:200px;
        height:200px;
        background:yellow;
    }
}
```

##### 语法

> animation： name duration timing-function delay iteration-count direction play-state fi11-mode;

* `name`:用来调用`@keyframes`定义好的动画，与`@keyframes`定义的动画名称一致
* `duration`:指定元素播放动画所持续的时间
* `timing-function`:规定速度效果的速度曲线，是针对每一个小动画所在时间范围的变换速率
* `delay`:定义在浏览器开始执行动画之前等待的时间，值整个`animation`执行之前等待的时间
* `iteration-count`:定义动画的播放次数，可选具体次数或者无限(`infinite`)
* `direction`:设置动画播放方向，有四个可选值
  * `normal` 按时间轴顺序
  * `reverse`时间轴反方向运行
  * `alternate`轮流，即来回往复行
  * `alternate-reverse`动画先反运行再正方向运行，并持续交替运行
* `play-state`:控制元素动画的播放状态，通过此来控制动画的暂停和继续，两个值
  * `running`继续
  * `paused`暂停
* `fll-mode`:控制动画结束后，元素的样式，有四个值
  * `none`回到动画没开始时的状态
  * `forwards`动画结束后动画停留在结束状态
  * `backwords`动画回到第一帧的状态
  * `both` 根据`animation-direction`轮流应用`forwards`和`backwards`规则)，注意与`iteration-count`不要冲突（动画执行无限次）

### animation 与 transition 的不同

animation与transition 不同的是，keyframes提供更多的控制，尤其是时间轴的控制，这点让css animation更加强大，使得flash的部分动画效果可以由css直接控制完成，而这一切，仅仅只需要几行代码，也因此诞生了大量基于css的动画库，用来取代flash的动画部分。

###  Css 动画实现中常用的一些易混淆的概念

`animation(动画)`：用于设置动画属性，他是一个简写的属性，包含6个属性
`transtion(过渡)`;用于设置元素的样式过度，和animation有着类似的效果，但细节上有很大的不同

`transform(变形)`：用于元素进行旋转、缩放、移动或倾斜，和设置样式的动画并没有什么关系，就相当于color一样用来设置元素的"外表"
`translate(移动)`：translate只是transform的一个属性值，即移动。

## 三角形

- border-top: solid 100px red;
- border-left: 50px solid transparent;

## [css3新特性]( https://juejin.im/entry/595f1e3c5188250d914dd53c) 

​	1. 选择器 模糊匹配  

    2. transition transform animation
    3. 边框
    4. 圆角
    5. 背景新方法
    6. 文字效果
    7. 渐变
  8. @font-face特性
    9. 多列布局
  10. resize box-sizing outline-offset
  11. 媒体查询 @media

## 可继承属性

字体系列属性 

* font-family 
* font   组合字体
* font-weight  字体粗细
* font-size  字体大小
* font-style  字体风格
* font-variant  偏大或偏小的字体

文本系列属性

* text-indent  文本缩进
* text-aligh  水平对齐
* line-height  行高
* word-spacing   单词间隔
* letter-spacing  字符间隔
* text-transform  文字大小写 
* direction 文本方向
* color  颜色

元素可见性

* visibility

表格布局属性 

* caption-side定位表格标题位置
* border-collapse合并表格边框
* border-spacing设置相邻单元格的边框间的距离
* empty-cells单元格的边框的出现与消失
* table-layout表格的宽度由什么决定<automatic.fixed.inherit>

列表布局属性

* list-style-type文字前面的小点点样式
* list-style-position小点点位置
* list-style以上的属性可通过这属性集合

引用

* quotes设置嵌套引用的引号类型

光标属性

* cursor 变箭头

## 不可继承属性

display

文本属性

* vertical-align 垂直居中

* text-decoration  文本装饰

* text-shadow 文本阴影

* white-space 空白符的处理

盒模型

width、height、margin 、margin-top、margin-right、margin-bottom、margin-left、border、border-style、border-top-style、border-right-style、border-bottom-style、border-left-style、border-width、border-top-width、border-right-right、border-bottom-width、border-left-width、border-color、border-top-color、border-right-color、border-bottom-color、border-left-color、border-top、border-right、border-bottom、border-left、padding、padding-top、padding-right、padding-bottom、padding-left

背景属性

background、background-color、background-image、background-repeat、background-position、background-attachment

定位属性

float、clear、position、top、right、bottom、left、min-width、min-height、max-width、max-height、overflow、clip、z-index

## css-next语法

自定义属性

- 定义
  - 在 :root 选择器定义一个css属性
  - :root{- -mainColor:#EFEFEF; }
- 使用
  - 使用 var(xx) 调用自定义属性
  - .test{color:var(- -mainColor)}

自定义属性集

- 定义

  - 在 :root 选择器定义一个css属性集

  - ```css
    :root{
    
    ​	- -fontCommon:{
    
    font-size:14px;
    
    font-family: 微软雅黑;
    
    ​	};
    
    }
    ```

- 使用

  - 使用 @apply xx 调用属性集

  - ```css
    .test{
    
    ​	@apply - -fontCommon;
    
    }
    ```

大小计算

- 一般用于px rem等的计算
- 语法：cale(四则运算)
- 允许使用变量进行计算

自定义媒体查询

- 定义
  - 语法 @custom-media xx (条件) and (条件)
  - @custom-media - -small-viewport (max-width: 30rem);
- 使用
  - @media (width >= 500px) and (width <= 1200px) {}
  - @media (- -small-viewport) {}

自定义选择器

- 定义

  - 语法：@custom-selector :name selector1, selector2;
  - @custom-selector 后必须有空格
  - @custom-selector :- -test .test1,.test2;

- 使用

  - 语法：:name

  - ```css
    :- -test{color:#fff;}
    /*编译后*/
    .test1,.test2{color: #fff;}
    ```

选择器嵌套

color()调整颜色

- 使用 color(value alpha(百分比)) 调整颜色
- .test {color: color(red alpha(-10%));}

font-family新增值system-ui

- system-ui 采用所有系统字体作为后备字体

## 选择器

CSS选择器是从右到左进行规则匹配

类型

- ID选择器
- class选择器
- 元素选择器
- 兄弟选择器
  - h2+p
- 子选择器
  - li>ul
- 后代选择器
  - ul li
- 通配符
  - *
- 属性选择器
  - type=“text”
- 伪类选择器

权重

- 伪类 < class < id < 行内样式

效率

- 如果有ID选择器，直接使用ID选择器即可
- 不要使用标签名限定class规则，有损灵活性
- 避免使用过度限制选择器
- 避免使用后代选择器，css中性能耗用最大的选择器
- 使用继承

# 移动端适配方案具体实现以及对比

## 常见的移动端适配方案

1. media queries
2. flex 布局
3. rem + viewport
4. vh/vw
5. 百分比

### 一、Meida Queries

meida queries 的方式可以说是我早期采用的布局方式，它主要是通过查询设备的宽度来执行不同的 css 代码，最终达到界面的配置。

##### 核心语法

```
@media only screen and (max-width: 374px) {
  /* iphone5 或者更小的尺寸，以 iphone5 的宽度（320px）比例设置样式*/
}
@media only screen and (min-width: 375px) and (max-width: 413px) {
  /* iphone6/7/8 和 iphone x */
}
@media only screen and (min-width: 414px) {
  /* iphone6p 或者更大的尺寸，以 iphone6p 的宽度（414px）比例设置样式 */
}
```

##### 优点

1. media query 可以做到设备像素比的判断，方法简单，成本低，特别是针对移动端和 PC 端维护同一套代码的时候。目前像 Bootstrap 等框架使用这种方式布局
2. 图片便于修改，只需修改 cSs 文件
3. 调整屏幕宽度的时候不用刷新页面即可响应式展示

##### 缺点

1. 代码量比较大，维护不方便
2. 为了兼顾大屏幕或高清设备，会造成其他设备资源浪费，特别是加载图片资源
3. 为了兼顾移动端和 PC 端各自响应式的展示效果，难免会损失各自特有的交互方式

### 二、Flex 弹性布局

以天猫的实现方式进行说明： 它的 viewport 是固定的：

```
<meta name="viewport" content-"width=device-width, initial-scale-1,maximum-scale-l, user-scalable-no">
```

高度定死，宽度自适应，元素都采用 px 做单位。 随着屏幕宽度变化，页面也会跟着变化，效果就和 PC 页面的流体布局差不多，在哪个宽度需要调整的时候使用响应式布局调调就行（比如网易新闻），这样就实现了『适配』。

### 三、rem+viewport 缩放

##### 实现原理：

根据 rem 将页面放大 dpr 倍，然后 viewport 设置为 1/dpr.

- 如 iphone6 plus 的 dpr 为3，则页面整体放大3倍,1px(css 单位)在 plus 下默认为 3px（物理像素）
- 然后 viewport 设置为 1/3，这样页面整体缩回原始大小。从而实现高清。

这样整个网页在设备内显示时的页面宽度就会等于设备逻辑像素大小，也就是 device-width。这个 device-width 的计算公式为： `设备的物理分辨率/(devicePixelRatio * scale)`

在 scale 为1 的情况下，`device-width = 设备的物理分辦率/devicePixelRatio`。

### 四、rem 实现

rem 是相对长度单位，rem 方案中的样式设计为相对于根元素 font-size 计算值的倍数。根据屏幕宽度设置 html 标签的 font-size，在布局时使用 rem 单位布局，达到自适应的目的。 viewport 是固定的

```
<meta name="viewport" content= "width=device-width, initial-scale-1,maximum-scale-l,user-scalable=no">
```

通过以下代码来控制 rem 基准值（设计稿以 720px 宽度量取实际尺寸）

```
!(function (d) {
  var c = d.document;
  var a = c.documentElement;
  var b = d.devicePixelRatio;
  var f;
  function e() {
    var h = a.getBoundingClientRect().width,
      g;
    if (b === 1) {
      h = 720;
    }
    if (h > 720) h = 720; //设置基准值的极限值
    g = h / 7.2;
    a.style.fontSize = g + "px";
  }
  if (b > 2) {
    b = 3;
  } else {
    if (b > 1) {
      b = 2;
    } else {
      b = 1;
    }
  }
  a.setAttribute("data-dpr", b);
  d.addEventListener(
    "resize",
    function () {
      clearTimeout(f);
      f = setTimeout(e, 200);
    },
    false
  );
  e();
})(window);
```

css 通过 sass 预编译，设置量取的 px 值转化 rem 的变量 $px:(1/100)+rem;

##### 优点：

- 兼容性好，页面不会因为伸缩发生变形，自适应效果更佳。

##### 缺点：

- 不是纯 css 移动适配方案，需要在头部內嵌一段 js 脚本监听分辦率的变化来动态改变根元素的字体大小，css 样式和 js 代码有一定耦合性，并且必须将改变 font-size 的代码放在 css样式之前。
- 小数像素问题，浏览器渲染最小的单位是像素，元素根据屏幕宽度自适应，通过 rem 计算后可能会出现小数像素，浏览器会对这部分小数四舍五入，按照整数渲染，有可能没那么准确。

### 五、纯ww 方案

视口是浏览器中用于呈现网页的区域。

- w:1vw 等于 视口宽度的1%
- vh:1vh 等于 视口高度的1%
- vmin：选取vw 和vh中最小的那个
- vmax：选取w 和vh中最大的那个

虽然 vw 能更优雅的适配，但是还是有点小问题，就是宽，高没法限制。

```
$base_Vw = 375;
@ function ww ($px) {
  return ($px/ $base_vw) * 100vw
}
```

##### 优点：

1. 纯 css移动端适配方案，不存在脚本依赖问题。
2. 相对于 rem 以根元素字体大小的倍数定义元素大小，逻辑清晰简单。

##### 缺点：

1. 存在一些兼容性问题，有些浏览器不支持

### 六、ww +rem 方案

```
// scss 语法
// 设置html根元素的大小 750px->75 640px->64
// 将屏幕分成10份，每份作为根元素的大小。
$vw_fontsize: 75
@function rem($px) {
    // 例如：一个div的宽度为100px，那么它对应的rem单位就是（100/根元素的大小）* 1rem
    @return ($px / $vw_fontsize) * 1rem;
}
$base_design: 750
html {
    // rem与vw相关联
    font-size: ($vw_fontsize / ($base_design / 2)) * 100vw;
    // 同时，通过Media Queries 限制根元素最大最小值
    @media screen and (max-width: 320px) {
        font-size: 64px;
    }
    @media screen and (min-width: 540px) {
        font-size: 108px;
    }
}

// body 也增加最大最小宽度限制，避免默认100%宽度的 block 元素跟随 body 而过大过小
body {
    max-width: 540px;
    min-width: 320px;
}
```

### 七、百分比

使用百分比％定义宽度，高度用 px 固定，根据可视区域实时尺寸进行调整，尽可能适应各种分辨率，通常使用 `max-width / min-width` 控制尺寸范围过大或者过小。

##### 优点

1. 原理简单，不存在兼容性问题

##### 缺点

1. 如果屏幕尺度跨度太大，相对设计稿过大或者过小的屏幕不能正常显示，在大屏手机或横竖屏切换场景下可能会导致页面元素被拉伸变形，字体大小无法随屏幕大小发生变化。
2. 设置盒模型的不同属性时，其百分比设置的参考元素不唯一，容易使布局问题变得复杂。

## 适配1px问题

### 前置知识

像素可以分为物理像素(CSS像素）和设备像素。由于现在手机大部分是 Retina 高清屏幕，所以在PC 端和移动端存在设备像素比的概念。简单说就是你在 pc 端看到的 1px 和在移动端看到的 1px 是不一样的。 在PC 端上，像素可以称为 CSS 像素，PC 端上 dpr 为1。也就说你书写 css 样式是多少在 pc 上就显示多少。而在移动端上，像素通常使用设备像素。往往 PC 端和移动端上在不做处理的情况下 1px 显示是不同的。 一个物理像素等于多少个设备像素取决于移动设备的屏幕特性(是否是 Retina)和用户缩放比例。 如果是 Retina 高清屏幕，那么 dpr 的值可能为2 或者 3，那么当你在 pc 端上看到的 1px 时，在移动端上看到的就会是 2px 或者 3px。

##### CSS pixels

可以理解为 CSS 和JS的像素单位。它跟设备屏幕的像素没必然关系，比如 windows 的桌面显示器，当你修改显示器的硬件分辦率，或右击桌面修改分辨率，比如把 1920 的分辦率改成 800 分辦率，你会发现网页里的图 形和字体变得傻大傻大的，同样的显示器，原本能显示全宽网页，现在只能显示半宽，也就是说 CSS 像素变大了。所以，CSS 像素是可以被硬件和软件任意调节的单位。CSS 像素是独立于设备逻辑的，用于逻辑上衡量像 素的单位。CSS声明和几乎所有的 javascript 属性都使用 CSS 像素。

##### device pixels

可以理解为设备像素。官方的解释是：显示屏幕的最小物理单位，每个 dp 包含自己的颜色、高宽等，不可再细分。这种像素是真实的物理存在的，你打开一个空白记事本，拿起放大镜观察屏幕，看到的一个个像素格，就是device pixels。它是不可变的，设备一旦造出来就不会变大小和数量。官方在产品说明书上写的 1920x1080 就是说的物理像素。

##### dpi

可以理解为设备独立像素。dpi (Dots Per Inch， 每英寸点数是一个量度单位，指每一英寸长度中，取样、可显示或输出点的数目。每英寸的像素，类似于密度，即每英寸的像素点数量。

##### dpr

设备像素比dpr =设备像素 / cSs像素（某一方向上） 可以通过 window.devicePixelRatio 获取设备的 dpr 值。一般来说，在桌面的浏览器中，设备像素比 (dpr）等于 1，一个 CSs 像素就是代表的一个物理像素。而在移动端，大多数机型都不是为 1，其中 iphone 的 dpr普遍是2 和3，那么一个 CSS 像素不再是对应一个物理像素，而是2个和3 个物理像素。即我们通常在 css 中设置的 width：1px，对应的便是物理像素中的 2px。手机机型不同，dpr 可能不同。

> 以 iphone5 为例，iphone5 的 CSS 像素为 320px*568px，DPR 是2，所以其设备像素为 640px*1136px 640(px) / 320(px) = 2 1136(px) / 568(px)= 2 640(px)*1136(px) / 320(px) *568 (px)=4

##### 视口 viewport

浏览器上(或者 app 中的 webview)用来显示网页的那部分区域。业内总结出三个子概念。

###### 1. 布局视口 layout viewport

手机一般为了容纳为桌面浏览器设计的网站，默认布局 viewport 宽度远大于屏幕的宽度，为了让用户看到网站全貌，缩小网站。例如，apple 一般将 viewport 宽度定为 980px。主要意义是手机厂商不至于让自家手机变得可笑，在打开大于 980 宽度的页面的时候可以横向拖动，而不至于挤成一团。可以通过 `document. documentElement.clientwidth`来获取。

###### 2. 视觉视口 visual viewport:

屏幕的可视区域，即物理像素尺寸，可以通过 window.innerwidth 来获取。对于 iPhone 6 Plus 来说，在加了著名代码前提下，值是 414px，不加的话，值是 980px，著名代码如果改一改 `width=device-width,initial-scale-1.5`，这时值是276px。所以它是一个可变的值。

###### 3. 理想视口 ideal viewport:

最适合移动设备的 viewport, ideal viewport 的宽度等于移动设备的屏幕宽度 为了让 viewport 能够等于 ideal viewport，一般我们会添加 meta 标签。`width=device-width, initial-scale-1.0`的时候，视觉视口的大小。对于 iPhone 6 Plus 来说，是固定值414px。所以，理想视口就等于 设备宽度。

```
<meta name= "viewport" content= "width=device-width, initial-gcale=1.0, user-scalable=no"/>
width=device-wiath： 宽度为设备宽度
initial-scale: 缩放比为 1
user-scalable=no：是否允许用户自定义缩
```

### 解决方案

##### 1.border-image

基于 media 查询判断不同的设备像素比给定不同的 border-image:

```
.border_1px {
  border-bottom: 1px solid #000;
}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .border_1px {
    border-bottom: none;
    border-width: 0 0 1px 0;
    border-image: url(../img/1pxline.png) 0 0 2 0 stretch;
  }
}
```

##### 2.background-image

和 border-image 类似，准备一张符合条件的边框背景图，模拟在背景上。

```
.border_1px {
  border-bottom: 1px solid #000;
}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .border_1px {
    background: url(../img/1pxline.png) repeat-x left bottom;
    background-size: 100% 1px;
  }
}
```

上面两种都需要单独准备图片，而且圆角不是很好处理，但是可以应对大部分场景。

##### 3.伪类 + transform

基于 media 查询判断不同的设备像素比对线条进行缩放：

```
.border_1px:before {
  content: "";
  position: absolute;
  top: 0;
  height: 1px;
  width: 100%;
  background-color: #000;
  transform-origin: 50% 0%;
}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .border_1px:before {
    transform: scaleY(0.5);
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 3) {
  .border_1px:before {
    transform: scaleY(0.33);
  }
}
```

这种方式可以满足各种场景，如果需要满足圆角，只需要给伪类也加上 border-radius 即可。

##### 4.svg

上面我们 border-image 和 background-image 都可以模拟 1px 边框，但是使用的都是位图，还需要外部引入。 借助 PostCSS 的 postcss-write-svg 我们能直接使用 border-image 和 background-image 创建 svg 的 1px 边框：

```
@svg border_1px {
  height: 2px;
  @rect {
    fill: var(--color, black);
    width: 100%;
    height: 50%;
  }
}
.example {
  border: 1px solid transparent;
  border-image: svg(border_1px param(--color #00b1ff)) 2 2 stretch;
}

/* 编译后 */
.example {
  border: 1px solid transparent;
  border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='2px'%3E%3Crect fill='%2300b1ff' width='100%25' height='50%25'/%3E%3C/svg%3E")
    2 2 stretch;
}
```

上面的方案基本可以满足所有场景，而且不需要外部引入

##### 5 设置 viewport

通过设置缩放，让 CSS 像素等于真正的物理像素。 例如：当设备像素比为3 时，我们将页面缩放 1/3 倍，这时 1px 等于一个真正的屏幕像素。

```
const scale = 1 / window.devicePixelRatio;
const viewport = document.querySelector('meta[name="viewport"]');
if (!viewport) {
  viewport = document.createElement("meta");
  viewport.setAttribute("name", "viewport");
  window.document.head.appendChild(viewport);
}
viewport.setAttribute(
  "content",
  "width=device-width,user-scalable=no,initial-scale=" +
    scale +
    ",maximum-scale=" +
    scale +
    ",minimum-scale=" +
    scale
);
```

实际上，上面这种方案是早先 flexible 采用的方案。 当然，这样做是要付出代价的，这意味着你页面上所有的布局都要按照物理像素来写。这显然是不现实的，这时，我们可以借助 flexible 或 w、vh 来帮助我们进行适配。

##### 6.box-shadow

```
.boder_1px {
  box-shadow: inset 0 -1px 1px -1px #d4d6d7;
}

```

这个方案基本可以满足所有场景，不过有个缺点就是颜色会变浅

# 绘制特殊图形

## 实现一个半圆

原理：左上、右上角是圆角，右下、左下角是直角： 左上角、右上角的值为宽和高一样的值，右下角、左下角的值不变（等于0）；另外，因为还要设置高度值为原来高度的一半才是标准的半圆。

```css
/* 上半圆 */
.semi-circle{
  width:100px;
  height:50px; 
  background-color:#cb18f8;
  border-radius:50px 50px 0 0; /* 左上、右上、右下、左下 */
}
/* 下半圆 */
.semi-circle2{
  width:100px;
  height:50px; 
  background-color:#cb18f8;
  border-radius:0 0 50px 50px; /* 左上、右上、右下、左下 */
}
/* 左半圆 */
.semi-circle3{
  width:50px;
  height:100px; 
  background-color:#cb18f8;
  border-radius:50px 0 0 50px; /* 左上、右上、右下、左下 */
}
/* 右半圆 */
.semi-circle4{
  width:50px;
  height:100px; 
  background-color:#cb18f8;
  border-radius:0 50px 50px 0; /* 左上、右上、右下、左下 */
}
```

## 画一个三角形

```css
/** 正三角 */
.triangle {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 25px 40px 25px;
  border-color: transparent transparent rgb(245, 129, 127) transparent;
}

/** 倒三角 */
.triangle {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 40px 25px 0 25px;
  border-color:  rgb(245, 129, 127) transparent transparent transparent;
}
```

## 画出一个扇形

### 简单版

```css
/* 简版一  */
.sector1 {
   border-radius: 0  0  0 200px;
   width: 200px;
   height: 200px;
   background: yellowgreen;
}
 /* 简版二  */
.sector1 {
  width: 0;
  height: 0;
  border-width: 100px;
  border-style: solid;
  border-color: transparent transparent red;
  border-radius: 100px;
}
```

### 完整版

```css
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>使用css3绘制任意角度扇形</title>
  <style>
  .pie {
    position: relative;
    margin: 1em auto;
    padding: 0;
    width: 32em;
    height: 32em;
    border-radius: 100%;
    list-style: none;
    overflow: hidden;
    transform: rotate(0deg) /*针对mac safari浏览器兼容*/

  }
  .slice {   /*一个slice最多设置成一个90度的扇形，超过就需要多个slice进行拼接*/
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 50%;
    transform-origin: 0% 100%;/*设置旋转的基准点*/
  }
  .slice-1 {
    transform: rotate(-36deg) skewY(-54deg);/*通过配置rotate和skewY的值来设置扇形的角度和位置*/
    background: #FF0088;
 }
  .slice-2 {
    transform: rotate(-72deg) skewY(-54deg);
    background: #FF0000;
 }
 
  </style>
</head>
<body>
   <ul class='pie'>
      <li class='slice-1 slice'> </li>
      <li class='slice-2 slice'> </li>
  <ul>
</body>
</html>
2）实现方式二

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>扇形绘制</title>
    <style>
      .shanxing {
        position: relative;
        width: 200px;
        height: 200px;
        border-radius: 100px;
        background-color: yellow;
      }
      .sx1 {
        position: absolute;
        width: 200px;
        height: 200px;
        transform: rotate(0deg);
        clip: rect(
          0px,
          100px,
          200px,
          0px
        ); /*这个clip属性用来绘制半圆，在clip的rect范围内的内容显示出来，使用clip属性，元素必须是absolute的 */
        border-radius: 100px;
        background-color: #f00;
        /*-webkit-animation: an1 2s infinite linear; */
      }
      .sx2 {
        position: absolute;
        width: 200px;
        height: 200px;
        transform: rotate(0deg);
        clip: rect(0px, 100px, 200px, 0px);
        border-radius: 100px;
        background-color: #f00;
        /*-webkit-animation: an2 2s infinite linear;*/
      }
      /*绘制一个60度扇形*/
      .shanxing1 .sx1 {
        transform: rotate(-30deg);
      }
      .shanxing1 .sx2 {
        transform: rotate(-150deg);
      }

      /*绘制一个85度扇形*/
      .shanxing2 .sx1 {
        transform: rotate(-45deg);
      }
      .shanxing2 .sx2 {
        transform: rotate(-140deg);
      }

      /*绘制一个向右扇形，90度扇形*/
      .shanxing3 .sx1 {
        transform: rotate(45deg);
      }
      .shanxing3 .sx2 {
        transform: rotate(-45deg);
      }

      /*绘制一个颜色扇形 */
      .shanxing4 .sx1 {
        transform: rotate(45deg);
        background-color: #fff;
      }
      .shanxing4 .sx2 {
        transform: rotate(-45deg);
        background-color: #fff;
      }

      /*绘制一个不同颜色半圆夹角 */
      .shanxing5 .sx1 {
        transform: rotate(45deg);
        background-color: #f00;
      }
      .shanxing5 .sx2 {
        transform: rotate(-45deg);
        background-color: #0f0;
      }
    </style>
  </head>
  <body>
    <h2>CSS之如何绘制任意角度的扇形</h2>
    <div>
      扇形制作原理，底部一个纯色原形， 里面2个相同颜色的半圆，可以是白色,
      内部半圆按一定角度变化，就可以产生出扇形效果
    </div>
    <div class="shanxing">
      <div class="sx1"></div>
      <div class="sx2"></div>
    </div>
    <div class="shanxing shanxing1">
      <div class="sx1"></div>
      <div class="sx2"></div>
    </div>
    <div class="shanxing shanxing2">
      <div class="sx1"></div>
      <div class="sx2"></div>
    </div>
    <div class="shanxing shanxing3">
      <div class="sx1"></div>
      <div class="sx2"></div>
    </div>
    <div class="shanxing shanxing4">
      <div class="sx1"></div>
      <div class="sx2"></div>
    </div>
    <div class="shanxing shanxing5">
      <div class="sx1"></div>
      <div class="sx2"></div>
    </div>
  </body>
</html>
```

## 实现一个水波纹效果

```css
<style>
    .wave-content {
        height: 666px;
        width: 666px;
        left: 255px;
        top: 139px;
        position: relative;
    }

    .wave {
        position: absolute;
        left: 0px;
        top: 0px;
        height: 100%;
        width: 100%;
        transform-origin: center center;
        background-color: transparent;
        border: 1px solid #979797;
        animation-duration: 7s;
        animation-name: wv;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        border-radius: 50%;
        opacity: 0;
    }

    .wave1 {
        animation-delay: 0s;
    }

    .wave2 {
        animation-delay: 1.5s;
    }

    .wave3 {
        animation-delay: 3s;
    }

    .wave4 {
        animation-delay: 4.5s;
    }

    @keyframes wv {
        0% {
            opacity: 0;
            transform: scale(0.5);
        }

        30% {
            opacity: 0.7;
            transform: scale(0.65);
        }

        70% {
            opacity: 0.1;
            transform: scale(0.85);
        }

        100% {
            opacity: -0.2;
            transform: scale(1);
        }
    }
</style>
<div class="wave-content ">
    <div class="wave wave1 "></div>
    <div class="wave wave2 "></div>
    <div class="wave wave3 "></div>
    <div class="wave wave4"></div>
</div>buju 
```

## 

