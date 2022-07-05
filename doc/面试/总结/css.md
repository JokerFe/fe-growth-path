### 1.选择符

| 选择器   | 实例        | 说明              | CSS版本 |
| -------- | ----------- | ----------------- | ------- |
| .class   | .intro      | class选择器       | 1       |
| #id      | #intro      | id选择器          | 1       |
| element  | p           | 标签选择器        | 1       |
| e e      | div p       | 后代选择器        | 1       |
| :link    | a:link      | 未访问过的链接    | 1       |
| :hover   | a:hover     | 鼠标放在上面      | 1       |
| :active  | :active     | 访问过的链接      | 1       |
| *        | *           | 通配符            | 2       |
| e>e      | div>p       | 所有父级为div的p  | 2       |
| e+e      | div+p       | 紧挨着div之后的p  | 2       |
| [target] | [target]    | 所有带targe属性的 | 2       |
| :focus   | input:focus | 获取焦点的元素    | 2       |
| :before  | p:before    | 在p之前插入内容   | 2       |
| :after   | p:after     | 在p之后插入内容   | 2       |

##### css3

![css3选择符](/Users/GHH/Library/Mobile Documents/iCloud~com~coderforart~iOS~MWeb/Documents/总结/img/css3选择符.png)

### 2. css可继承属性

* 字体系列属性 
  * font-family 
  * font   组合字体
  * font-weight  字体粗细
  * font-size  字体大小
  * font-style  字体风格
  * font-variant  偏大或偏小的字体
* 文本系列属性
  * text-indent  文本缩进
  * text-aligh  水平对齐
  * line-height  行高
  * word-spacing   单词间隔
  * letter-spacing  字符间隔
  * text-transform  文字大小写 
  * direction 文本方向
  * color  颜色
* 元素可见性
  * visibility
* 表格布局属性 
  * caption-side定位表格标题位置
  * border-collapse合并表格边框
  * border-spacing设置相邻单元格的边框间的距离
  * empty-cells单元格的边框的出现与消失
  * table-layout表格的宽度由什么决定<automatic.fixed.inherit>
* 列表布局属性
  * list-style-type文字前面的小点点样式
  * list-style-position小点点位置
  * list-style以上的属性可通过这属性集合
* 引用
  * quotes设置嵌套引用的引号类型
* 光标属性
  * cursor 变箭头

### 3. css不可继承属性

* display
* 文本属性
  * vertical-align 垂直居中
  * text-decoration  文本装饰
  * text-shadow 文本阴影
  * white-space 空白符的处理

* 盒模型

  width、height、margin 、margin-top、margin-right、margin-bottom、margin-left、border、border-style、border-top-style、border-right-style、border-bottom-style、border-left-style、border-width、border-top-width、border-right-right、border-bottom-width、border-left-width、border-color、border-top-color、border-right-color、border-bottom-color、border-left-color、border-top、border-right、border-bottom、border-left、padding、padding-top、padding-right、padding-bottom、padding-left

* 背景属性

  background、background-color、background-image、background-repeat、background-position、background-attachment

* 定位属性

  float、clear、position、top、right、bottom、left、min-width、min-height、max-width、max-height、overflow、clip、z-index