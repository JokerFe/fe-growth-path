1.treeshaking webpack-deep-scope-plugin webpack-parallel-uglify-plugin purifycss-webpack

Tree Shaking 对于那些无副作用的模块也会生效了。  package.json 中 指定"sideEffects": false 例如：lodash-es

2.cache-loader 加快编译速度

3.progress-bar-webpack-plugin 打包进度展示 

4.更友好的提示错误

friendly-errors-webpack-plugin

webpack-build-notifier 

5.set-iterm2-badge && node-bash-title 标题和窗口内容修改 

6.webpack-manifest-plugin 服务端生成性能配置文件 

7.happypack 多线程编译webpack 不支持的情况下使用thread-loader 

8.speed-measure-webpack-plugin 打包速度分析

9.prepack-webpack-plugin 代码求值 

10.splitchunks公用库的代码拆分 去除打包

11.使用动态 polyfill

<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Map,Set"></script>

它会根据你的浏览器 UA 头，判断你是否支持某些特性，从而返回给你一个合适的 polyfill。

<script type="module" src="./main.js"></script>

<script nomodule src="main.es5.js"></script>

8.prerender-spa-plugin  渲染首屏 

9.html-webpack-inline-source-plugin 内部资源引入

10.inline-manifest-webpack-plugin 把runtime放到html里

11.webpack-dashboard 增强了 webpack 的输出，包含依赖的大小、进度和其他细节。

   webpack-bundle-analyzer  打包结果分析

   webpack --profile --json > stats.json

   14-1 <http://alexkuz.github.io/webpack-chart/>

   14-2 <http://webpack.github.io/analyse/>

12.多核压缩uglifyjs-webpack-plugin 官方维护 非官方维护webpack-parallel-uglify-plugin

13.cache-loader loader的缓存  => 'babel-loader?cacheDirectory=true'

exclude: /node_modules/, // 排除不处理的目录

  include: path.resolve(__dirname, 'src') // 精确指定要处理的目录 

14.合理的devtool 

​    eval： 生成代码 每个模块都被eval执行，并且存在@sourceURL

​    cheap-eval-source-map： 转换代码（行内） 每个模块被eval执行，并且sourcemap作为eval的一个dataurl

​    cheap-module-eval-source-map： 原始代码（只有行内） 同样道理，但是更高的质量和更低的性能

​    eval-source-map： 原始代码 同样道理，但是最高的质量和最低的性能

​    cheap-source-map： 转换代码（行内） 生成的sourcemap没有列映射，从loaders生成的sourcemap没有被使用

​    cheap-module-source-map： 原始代码（只有行内） 与上面一样除了每行特点的从loader中进行映射

​    source-map： 原始代码 最好的sourcemap质量有完整的结果，但是会很慢

19.移除无用的框架的代码的警告 optimization.nodeEnv: 'production'

20.集成到CI 监控文件的大小 <https://github.com/siddharthkp/bundlesize>

21.lodash-webpack-plugin 自动化去除无用代码 

[22.name-all-modules-plugin](/Users/GHH/Library/Application Support/typora-user-images/56E525C9-F439-4722-8D76-7C32CCBE5FC2/22.name-all-modules-plugin) 保证chunkid不变

23.多入口解决方案 

resolve: {

​        alias: {

​            '@': path.resolve(__dirname, '../src')

​        }

}

minify: process.env.NODE_ENV === "development" ? false : {

​    removeComments: true, //移除HTML中的注释

​    collapseWhitespace: true, //折叠空白区域 也就是压缩代码

​    removeAttributeQuotes: true, //去除属性引用

}

24.babelrc 按需引用

babel-plugin-transform-imports 

babel-plugin-transform-modules（可以加载css）

import { Dialog } form 'cube-ui'

"plugins": [

  ["transform-modules", {

​     "cube-ui": {

​       "transform": "cube-ui/lib/${member}",

​       "preventFullImport": true,

​       "kebabCase": true,

​       "style": true

​     }

  }]

]

25.CSS公用提取

 styles: {

​     name: 'styles',

​     test: /\.css$/,

​     chunks: 'all',

​     enforce: true,

​     priority: 20,

}