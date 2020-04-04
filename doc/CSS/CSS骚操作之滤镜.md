

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

![](../imgs/CSS/wang5.jpeg)

