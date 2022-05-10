[toc]

## 一、实现 DIV 宽度自适应，宽高保持等比缩放

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

## 二、实现多列等高布局，元素实际占用的高度以多列中较高的为准

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

