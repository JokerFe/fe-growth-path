# webpack 多页面打包

## 前言

现在告别了 JQuery 一把梭，是不是又渐渐习惯了，React、Vue 全家桶，npm run dev、 npm run build 一把梭。
然而现实中，很多场景下，单页应用的开发模式并不适用。比如公司经常开发一些活动页。

```text
activityl.html
activity2.html
activity3.html
```

像上边三个页面是完全不相干的活动页，页面之间并没有共享的数据。然而每个页面都使用了 React 框架，并且三个页面都使用了通用的弹框组件。在这种场景下，就需要使用webpack 多页面打包的方案了。

1. 保留了传统单页应用的开发模式：使用 Vue, React 等前端框架，支持模块化打包，你可以把每个页面看成是一个单独的单页应用
2. 独立部署：每个页面相互独立，可以单独部署，解耦项目的复杂性，你甚至可以在不同的页面选择不同的技术栈

## 多页面打包的原理

可以约定，src/pages 目录下，每个文件夹为单独的一个页面。每个页面至少有两个文件配置：

1. app.js： 页面逻辑入口
2. index.html 页面的 html 模板

##### 如何将每个页面看做是一个独立的单页应用进行打包呢？

这时可以通过配置 webpack 的 entry，多页应用只需配置多个 entry 即可。

```js
module.exports = {
  entry: {
    page1: "./src/pages/page1/app.js", // 页面1
    page2: "./src/pages/pages/app.js", // 页面2
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "js/[name]/[name]-bundle.js",
  },
};
```

因为多个活动有多个模板，所以可以配置多个 HtmIWebpackPlugin

> 注意：HtmlWebpackPlugin 一定要配 chunks，否则所有页面的js 都会被注入到当前 html 里 

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      templage: "./src/pages/page1/index.html",
      chunks: ["page1"],
    }),
    new HtmlWebpackPlugin({
      templage: "./src/pages/page2/index.html",
      chunks: ["page2"],
    }),
    new HtmlWebpackPlugin({
      templage: "./src/pages/page3/index.html",
      chunks: ["page3"],
    }),
  ],
};

```

## 代码示例

#### 基本思路

基本思路就是每个页面对应一个 entry，一个 htm1-webpack-plugin，但是这样的缺点就是每次新增或删除页面需要改 webpack 配置，如下所示：

```js
module.exports = {
  entry: {
    index: './src/index.js',
    search: './src/search.js'
  },
  output: {
    path:path.resolve(__dirname, 'dist'),
    filename: '[name]-bundle.js'
  }，
  plugins: [
  	new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html',
      chunks: ['index'],
      inject: true,
      minify: {
      	html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/search.html'),
      filename: 'search.html',
      chunks: ['search'],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    })  
  ]
}
```

#### 通用方案

利用 glob.sync 动态获取 entry 和设置 `html-webpack-plugin` 数量（不过要求src里面的入口必须按照` . /sre/*/index. js `来配置，比如` ./src/ index/index. js `或`./src/serach/index.js`，并且在该目录下放入相应的html/模板，比如`./src/ index/index.html `或者 `. / sre/serach/ index.html`)
如下所示：

```js
const setMPA = () => {
  const entrys = {};
  const htmlWebpackPlugins = [];
  // 按照上面说的格式来动态获取入口文件
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))
  Object.keys(entriyFiles).map(index => {
    const entryFile = entryFiles[index];
    const match = entryFiles.match(/src\/(.*)\/index.js/);
    const pageName = match && match[1];
    entry[pageName] = entryFile;
    htmlWebpackPlugins.push({
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [${pageName}],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false
        }
      }) 
    })
  })
  return {
    entry, htmlWebpackPlugins
  }
}
const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
	entry: entry,
  ...
  plugins: [
    ...
  ].concat(htmlWebpackPlugins),
}
```

