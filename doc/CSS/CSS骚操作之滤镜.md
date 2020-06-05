

# CSS骚操作之滤镜

## 前言

>  为表达全国各族人民对抗击新冠肺炎疫情斗争牺牲烈士和逝世同胞的深切哀悼，国务院今天（4月3日）发布公告，决定2020年4月4日举行全国性哀悼活动。在此期间，全国和驻外使领馆下半旗志哀，全国停止公共娱乐活动。4月4日10时起，全国人民默哀3分钟，汽车、火车、舰船鸣笛，防空警报鸣响。
>
> 愿逝者安息，愿生者奋发，愿祖国昌盛。

为响应国家对全国各族人民对抗击新冠肺炎疫情斗争牺牲烈士和逝世同胞的深切哀悼，各大平台网站都变成暗灰色系，那么从一个前端程序猿的角度出发，如何快速的实现？直接上代码：

```css
/** 将页面所有元素修改为黑白 */
html {
    -webkit-filter: grayscale(100%); /* Chrome, Safari, Opera */
    filter: grayscale(100%);
}
```

## 语法

> **`filter `**CSS属性将模糊或颜色偏移等图形效果应用于元素。滤镜通常用于调整图像，背景和边框的渲染。 -- **MDN**

```css
/* URL to SVG filter */
filter: url("filters.svg#filter-id");

/* <filter-function> values */
filter: blur(5px);
filter: brightness(0.4);
filter: contrast(200%);
filter: drop-shadow(16px 16px 20px blue);
filter: grayscale(50%);
filter: hue-rotate(90deg);
filter: invert(75%);
filter: opacity(25%);
filter: saturate(30%);
filter: sepia(60%);

/* Multiple filters */
filter: contrast(175%) brightness(3%);

/* Global values */
filter: inherit;
filter: initial;
filter: unset;
```

###  `grayscale()`

将图像转换为灰度图像。值定义转换的比例。值为100%则完全转为灰度图像，值为0%图像无变化。值在0%到100%之间，则是效果的线性乘子。若未设置，值默认是0。

### `brightness()`

给图片应用一种线性乘法，使其看起来**更亮或者更暗**。如果值是0%，图像会全黑。如果值为100%，则图像无变化。其他的值对应线性乘法效果。超过100%，图像会比原来更亮。如果没有设定值，默认为1。

### `blur()`

给图像设置**高斯模糊**。`radius`值设定高斯函数的标准差，或者是屏幕上以多少像素融在一起，所以值越大越模糊；如果没有设定值，则默认是0；这个参数可设置css长度值，但不接受百分比值。

### `contrast()`

调整图像的**对比度**。值是0%的话，图像全黑。值是100%，图像不变。超过100%，一位置会运用更低的对比。若没有设置值，默认是1。

### `drop-shadow()`

给图像设置一个阴影效果。阴影是合成在图像下面，可以有模糊度的，可以以特定颜色画出的遮罩图的偏移版本。 函数接受`（`在CSS3背景中定义）类型的值，除了“inset”关键字是不允许的。该函数与已有的`box-shadow` [`box-shadow`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow)属性很相似；不同之处在于，通过滤镜，一些浏览器为了更好的性能会提供硬件加速。

### `hue-rotate()`

给图像应用色相旋转。“angle”一值设定图像会被调整的色环角度值。值为0deg，则图像无变化。若值未设置，默认值是0deg。该值虽然没有最大值，超过360deg的值相当于又绕一圈。

### `invert()`

反转输入图像。值定义转换的比例。100%的价值是完全反转。值为0%则图像无变化。值在0%和100%之间，则是效果的线性乘子。 若值未设置，值默认是0。

### `opacity()`

转化图像的透明程度。值定义转换的比例。值为0%则是完全透明，值为100%则图像无变化。值在0%和100%之间，则是效果的线性乘子，也相当于图像样本乘以数量。 若值未设置，值默认是1。该函数与已有的opacity属性很相似，不同之处在于通过filter，一些浏览器为了提升性能会提供硬件加速。

### `saturate()`

转换图像饱和度。值定义转换的比例。值为0%则是完全不饱和，值为100%则图像无变化。其他值，则是效果的线性乘子。超过100%的值是允许的，则有更高的饱和度。 若值未设置，值默认是1。

### `sepia()`

将图像转换为深褐色。值定义转换的比例。值为100%则完全是深褐色的，值为0%图像无变化。值在0%到100%之间，则是效果的线性乘子。若未设置，值默认是0。

![滤镜](https://raw.githubusercontent.com/Jokul518/fe-growth-path/master/imgs/CSS/滤镜.png)

## 复合函数

你可以组合任意数量的函数来控制渲染。

### 图片增亮

```css
filter: contrast(175%) brightness(3%)
```



##### 参考文章：

[filter -- MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)

[你所不知道的 CSS 滤镜技巧与细节](https://www.cnblogs.com/coco1s/p/7519460.html)

