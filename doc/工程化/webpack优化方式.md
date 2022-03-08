# Webpack的优化方式

### 构建速度优化

1. 使用高版本的Webpack

2. 多线程/多进程进行构建： HappyPack(已停止更新维护)、thread-loader

3. 缩小打包作用域

   * exclude/include(指定打包范围)
   * resolve.modules 指明第三方模块的绝对路径(减少打包时的不必要查找)
   * resolve.extensions尽可能减少后缀尝试的可能
   * noParse对完全不需要解析的进行忽略，不去解析但仍会打包到bundle中，注意被忽略掉的文件里不应该包含import、require、define等模块话语句
   * IgnorePlugin 完全排除模块
   * 合理使用alias

4. 充分利用缓存提升二次构建速度

   * babel-loader开启缓存
   * terser-webpack-plugin开启缓存‘
   * 使用cache-loader或者hard-source-webpack-plugin

   注意： thread-loader和cache-loader要一起使用的话，先设置cache-loader，然后是 thread-loader，最后是heavy-loader

5. DLL，使用DllPlugin进行分包，使用DllReferencePlugin（索引链接）对mainfest.json引用，让一些基本不会改动的代码先打包成静态资源，避免反复编译浪费时间

##### 使用webpack4优化的原因

### **优化 webpack 的打包体积**

- 压缩代码
  - webpack-paralle-uglify-plugin
  - uglifyjs-webpack-plugin 开启 parallel 参数 (不支持es6)
  - terser-webpack-plugin 开启 parallel 参数
  - 多进程并行压缩
  - 通过 html-webpack-externals-plugin 提取 chunk 中的 css 代码到单独文件，通过optimize-css-assets-webpack-plugin插件 开启 cssnano 压缩 css。
- 提取页面公共资源：
  - 使用 html-webpack-external-plugin，将基础包通过 CDN 引入，不打入bundle 中
  - 使用 SpliteChunkPlugin 进行(公共脚本、基础包、页面公共文件)分离(webpack4内置) ，替代了 CommonsChunkplugin 插件
  - 基础包分离：将一些基础库放到CDN，比如vue，webpack 配置 external是的vue不打入bundle
- Tree Sharking
  - purgecss-webpack-plugin 和 mini-css-extract-plugin配合使用(建议)
  - 打包过程中检测工程中没有引用过的模块并进行标记，在资源压缩时将它们从最终的bundle中去掉(只能对ES6 Module生效) 开发中尽可能使用ES6 Module的模块，提高Tree Sharking效率
  - 禁用 斄攊斄壝攋-攋壏攊攃壝巇 的模块依赖解析，否则 webpack 接收到的就都是转换过的 濲壏斅斅壏壣攡廭 形式的模块，无法进行 瀀巇壝壝-斔擾攊孂廽壣噖
  - 使用 廰孆巇廽濱巙濲廭廭(不在维护) 或者 孆壣css 去除无用 濲廭廭 代码
- 廭噕壏巒壝 擾壏廽斔瀀廽壣噖
  - 构建后的代码会存在大量闭包，造成体积增大，运行代码时创建的函数作用域变多，内存开销变大。廭噕壏巒壝 擾壏廽斔瀀廽壣噖 将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突
  - 必须是厳廭6的语法，因为有很多第三方库仍采用 濲壏斅斅壏壣攡廭 语法，为了充分发挥 廭噕壏巒壝 擾壏廽斔瀀廽壣噖 的作用，需要配置 斅攊廽壣攦廽壝攋攃斔 对第三方模块优先采用 廯斔壣壝擸瀀:斅攊廽壣 中指向的厳廭6模块化语法
- 图片压缩
  - 使用基于 攈壏攃壝 库的 廽斅攊噖壝斅廽壣 (很多定制选项、可以处理多种图片格式)
  - 配置 廽斅攊噖壝-webpack-攋壏攊攃壝巇
- 动态廰壏攋巙濱廽攋攋
  - 建议采用 巒壏攋巙濱廽攋攋-斔壝巇瀃廽噕壝 只给用户返回需要的巒壏攋巙濱廽攋攋，社区维护。(部分国内奇葩浏览器孴壓可能无法识别，但可以降级返回所需全部巒壏攋巙濱廽攋攋)
  - @斄攊斄壝攋-巒巇壝斔壝瀀-壝壣瀃 中通过孆斔壝霫孆廽攋瀀婾壣斔: '孆斔攊噖壝参数来动态加载巒壏攋巙濱廽攋攋。

**3）斔巒壝壝攃-斅壝攊斔孆巇壝-webpack-plugin** 简称 廭攨廰，分析出 webpack 打包过程中 攎壏攊攃壝巇 和 plugin 的耗时，有助于找到构建过程中的性能瓶颈。

