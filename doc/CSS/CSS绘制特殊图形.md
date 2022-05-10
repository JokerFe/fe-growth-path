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