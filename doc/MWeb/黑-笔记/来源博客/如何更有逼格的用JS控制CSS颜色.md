# 如何更有逼格的用JS控制CSS颜色

## 背景知识：颜色模型

点开这篇文章的你，肯定是想要学习怎样控制颜色的——我们后面就会讲具体操作。但首先，我们需要对 CSS 如何标记颜色有一个基本的认识。CSS 使用的是两种颜色模型：RGB 和 HSL，我们先简单了解一下。

### RGB

RGB 就是“红色，绿色，蓝色”的简称。这个模型由三个数字组成，每个数字表示其所代表的颜色在最终生成的颜色中有多高的亮度。在 CSS 中，每个数值的范围都是 0-255，三个数值间用逗号分隔，作为 CSS rgb 函数的参数，例如：rgb（50,100,0）。

RGB 是一种“增量”颜色系统。这意味着每个数字越高，最终生成的颜色就越亮。如果所有值都相等就生成灰度颜色；如果所有值都为零，结果为黑色；如果所有值都是 255，则结果为白色。

此外你也可以使用十六进制表示法来标记 RGB 颜色，其中每种颜色的数值从 10 进制转换为 16 进制。例如，rgb（50,100,0）用 16 进制就写成＃326400。

虽然我个人比较习惯使用 RGB 模型（特别是十六进制），但我也经常发现它不易阅读，也不容易操作。下面来看 HSL 模型。

### HSL

HSL是“色调，饱和度，光线”的简称，HSL 也包含三个值。色调值对应于色轮上的点，由 CSS 角度值表示，最常用的是度数单位。

饱和度以百分比表示，是指颜色的强度。当饱和度为 100％时颜色最深，饱和度越低，颜色越浅，直到灰度为 0％。

亮度也以百分比表示，指的是颜色有多亮。“常规”的亮度是 50％。无论色调和饱和度值如何，100％的亮度都是纯白色，0％的亮度就是纯黑色。

我觉得 HSL 模型更直观一些，颜色之间的关系更加明显，控制颜色时只要简单地调整几个数字就可以了。

### 颜色模型之间的转换

RGB 和 HSL 颜色模型都将颜色分解为各种属性。要在不同模型之间进行转换，我们首先需要计算这些属性。

除了色调，上面提到的所有数值都可以表示为百分比。就连 RGB 值也是用字节表示的百分比。在下面提到的公式和函数中，这些百分比将由 0 到 1 之间的小数来表示。

这里提一下，我并不会深入探讨这些数学知识；相比之下，我将简要介绍一遍原始数学公式，然后将其转换为 JavaScript 格式。

### 从 RGB 模型中计算亮度

亮度是三个 HSL 值中最容易计算的一个。其数学式如下，其中 M 是 RGB 值的最大值，m 是最小值：

![如何更有逼格的用JS控制CSS颜色？](http://p9.pstatp.com/large/pgc-image/57e26e7ed46242fc99caa0c8112d7ba8)



亮度的数学式

用 JavaScript 函数写成下面的形式：

```js
const rgbToLightness =（r，g，b）=>
 1/2 *（Math.max（r，g，b）+ Math.min（r，g，b））;
```

### 从 RGB 模型中计算饱和度

饱和度仅比亮度稍微复杂一些。如果亮度为 0 或 1，则饱和度值为 0；否则，它基于下面的数学公式计算得出，其中 L 表示亮度：

![如何更有逼格的用JS控制CSS颜色？](http://p1.pstatp.com/large/pgc-image/24f5164ff74a4c848053f96c0c85c45c)



饱和度的数学式

写成 JavaScript：

```js
const rgbToSaturation = (r,g,b) => {
 const L = rgbToLightness(r,g,b);
 const max = Math.max(r,g,b);
 const min = Math.min(r,g,b);
 return (L === 0 || L === 1)
 ? 0
 : (max - min)/(1 - Math.abs(2 * L - 1));
};
```

### 从 RGB 模型中计算色调

从 RGB 坐标中计算色调角度的公式有点复杂：

![如何更有逼格的用JS控制CSS颜色？](http://p1.pstatp.com/large/pgc-image/aa25ae7a62da458fbc14ead0d22b30df)



色调的数学式

写成 JavaScript：

```js
const rgbToHue = (r,g,b) => Math.round(
 Math.atan2(
 Math.sqrt(3) * (g - b),
 2 * r - g - b,
 ) * 180 / Math.PI
);
```

最后 180 / Math.PI 的算法是将结果从弧度转换为度。

### 计算 HSL

上面这些函数都可以包含在同一个功能函数里：

```js
const rgbToHsl = (r,g,b) => {
 const lightness = rgbToLightness(r,g,b);
 const saturation = rgbToSaturation(r,g,b);
 const hue = rgbToHue(r,g,b);
 return [hue, saturation, lightness];
}
```

### 从 HSL 模型中计算 RGB 值

开始计算 RGB 之前，我们需要一些前提值。

首先是“色度”值：

![如何更有逼格的用JS控制CSS颜色？](http://p3.pstatp.com/large/pgc-image/44e990f3b9b0441ab529b770c9d75145)

色度的数学式

还有一个临时的色调值，我们将用它来确定我们所属的色调圈的“段”：

![如何更有逼格的用JS控制CSS颜色？](http://p1.pstatp.com/large/pgc-image/27ccecc5c5ec4922811f2bdee5b6685c)

色调区间的数学式

接下来，我们设一个“x”值，它将用作中间（第二大）组件值：

![如何更有逼格的用JS控制CSS颜色？](http://p1.pstatp.com/large/pgc-image/9de905c0c7224858a3b0b4bd6c8bf0a1)

临时“x”值的数学式

我们再设一个“m”值，用于调整各个亮度值：

![如何更有逼格的用JS控制CSS颜色？](http://p3.pstatp.com/large/pgc-image/b5def78a8feb4a4ab894e7be566523a4)

亮度匹配的数学式

根据色调区间值，r，g 和 b 值将映射到 C，X 和 0：

![如何更有逼格的用JS控制CSS颜色？](http://p1.pstatp.com/large/pgc-image/5eeaa298b2a045bc87c9e5d482582536)

RGB 值的数学式，不考虑亮度

最后，我们需要映射每个值以调整亮度：

![如何更有逼格的用JS控制CSS颜色？](http://p3.pstatp.com/large/pgc-image/751351f6bd9a4eefaa49524b09a7503f)

用 RGB 来解释亮度的数学式

将上面这些都写到 JavaScript 函数中：

```js
const hslToRgb = (h,s,l) => {
 const C = (1 - Math.abs(2 * l - 1)) * s;
 const hPrime = h / 60;
 const X = C * (1 - Math.abs(hPrime % 2 - 1));
 const m = l - C/2;
 const withLight = (r,g,b) => [r+m, g+m, b+m];
if (hPrime <= 1) { return withLight(C,X,0); } else
 if (hPrime <= 2) { return withLight(X,C,0); } else
 if (hPrime <= 3) { return withLight(0,C,X); } else
 if (hPrime <= 4) { return withLight(0,X,C); } else
 if (hPrime <= 5) { return withLight(X,0,C); } else
 if (hPrime <= 6) { return withLight(C,0,X); }
}
```

### 创建颜色对象

为了便于在操作属性时访问，我们将创建一个 JavaScript 对象。把前面提到的这些函数打包起来就能创建这个对象：

```js
const rgbToObject = (red,green,blue) => {
 const [hue, saturation, lightness] = rgbToHsl(red, green, blue);
 return {red, green, blue, hue, saturation, lightness};
}
const hslToObject = (hue, saturation, lightness) => {
 const [red, green, blue] = hslToRgb(hue, saturation, lightness);
 return {red, green, blue, hue, saturation, lightness};
}
```

### 示例

我强烈建议你花些时间看看这个示例：

https://codepen.io/AdamGiese/full/86b353c35a8bfe0868a8b48683faf668

从中了解调节各个属性时其它属性如何发生变化，这样能帮助你更深入地了解两种颜色模型是如何对应的。

## 颜色控制

现在我们已经知道怎样在颜色模型之间进行转换了，那么就来看看该如何控制这些颜色！

### 更新属性

我们提到的所有颜色属性都可以单独控制，返回一个新的颜色对象。例如，我们可以编写一个旋转色调角度的函数：

```js
const rotateHue = rotation => ({hue, ...rest}) => {
 const modulo = (x, n) => (x % n + n) % n;
 const newHue = modulo(hue + rotation, 360);
return { ...rest, hue: newHue };
}
```

rotateHue 函数会接受一个旋转参数并返回一个新函数，该函数接受并返回一个颜色对象。这样就可以轻松创建新的“旋转”函数：

```js
const rotate30 = rotateHue(30);
const getComplementary = rotateHue(180);
const getTriadic = color => {
 const first = rotateHue(120);
 const second = rotateHue(-120);
 return [first(color), second(color)];
}
```

用这种方式，你也可以编写加深或提亮颜色的函数——或者反过来，减淡或变暗也行。

```js
const saturate = x => ({saturation, ...rest}) => ({
 ...rest,
 saturation: Math.min(1, saturation + x),
});
const desaturate = x => ({saturation, ...rest}) => ({
 ...rest,
 saturation: Math.max(0, saturation - x),
});
const lighten = x => ({lightness, ...rest}) => ({
 ...rest,
 lightness: Math.min(1, lightness + x)
});
const darken = x => ({lightness, ...rest}) => ({
 ...rest,
 lightness: Math.max(0, lightness - x)
});
```

### 颜色谓词

除了颜色控制以外，你还可以编写“谓词”——亦即返回布尔值的函数。

```js
const isGrayscale = ({saturation}) => saturation === 0;
const isDark = ({lightness}) => lightness < .5;
```

### 处理颜色数组

过滤器

JavaScript [] .filter 方法会接受一个谓词并返回一个新数组，其中包含所有“传递”的元素。我们在上一节中编写的谓词可以用在这里：

```js
const colors = [/* ... an array of color objects ... */];
const isLight = ({lightness}) => lightness > .5;
const lightColors = colors.filter(isLight);
```

排序

要对颜色数组进行排序，首先需要编写一个“比较器”函数。此函数接受一个数组的两个元素并返回一个数字来表示“赢家”。正数表示第一个元素应该先排序，而负数表示第二个元素应该先排序。零值表示平局。

例如，这是一个比较两种颜色亮度的函数：

```js
const compareLightness = (a,b) => a.lightness - b.lightness;
```

这是一个比较饱和度的函数：

```js
const compareSaturation = (a,b) => a.saturation - b.saturation;
```

为了防止代码重复，我们可以编写一个高阶函数来返回一个比较函数来对比各种属性：

```js
const compareAttribute = attribute =>
 (a,b) => a[attribute] - b[attribute];
const compareLightness = compareAttribute('lightness');
const compareSaturation = compareAttribute('saturation');
const compareHue = compareAttribute('hue');
```

平均属性

你可以搭配各种 JavaScript 数组方法来平衡颜色数组中的特定属性。首先，你可以使用 reduce 求和并用 Array length 属性分割来计算一个属性的均值：

```js
const colors = [/* ... an array of color objects ... */];
const toSum = (a,b) => a + b;
const toAttribute = attribute => element => element[attribute];
const averageOfAttribute = attribute => array =>
 array.map(toAttribute(attribute)).reduce(toSum) / array.length;
```

你可以用它来“规范化”一组颜色：

```js
/* ... continuing */
const normalizeAttribute = attribute => array => {
 const averageValue = averageOfAttribute(attribute)(array);
 const normalize = overwriteAttribute(attribute)(averageValue);
 return normalize(array);
}
const normalizeSaturation = normalizeAttribute('saturation');
const normalizeLightness = normalizeAttribute('lightness');
const normalizeHue = normalizeAttribute('hue');
```

### 结论

颜色是网络不可或缺的一部分。将颜色分解为属性就可以灵活控制它们，并创造出无限的可能。

查看英文原文：

https://blog.logrocket.com/how-to-manipulate-css-colors-with-javascript-fb547113a1b8