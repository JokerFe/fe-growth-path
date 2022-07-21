## Vue3源码分析之概览

> 相较于vue2，vue3主要从以下几个方面进行了优化升级： ①**源码架构**： 代码组织架构的变化、以及开发语言是**Typescript**；②模板编译；③响应式系统。

## 源码架构

vue2时期所有方法都挂载到vue的实例上，没有对外暴露出模板编译、响应式等的API，但是vue3通过组织架构的调整，不同的功能使用模块化的开发方式，使得不同的模块/API都能被单独使用，也就是**CompititionAPI**。

### 目录结构

```shell
.
...
├── package.json
├── packages/  # 核心内容
│   ├── compiler-core/  # 平台无关的编译器  生成render
│   ├── compiler-dom/   # 针对于浏览器的编译时
│   ├── compiler-sfc/   # 单文件编译，然后交给compiler-core处理
│   ├── compiler-ssr/   # 服务端渲染编译
│   ├── global.d.ts
│   ├── reactivity/     # 负责数据处理响应式数据
│   ├── runtime-core/   # 与平台无关的运行时， 维护vnode 渲染器、组件实例  自定义渲染器
│   ├── runtime-dom/    # 针对于浏览器而言的运行  虚拟dom转换成真实dom的过程
│   ├── runtime-test/
│   ├── server-renderer/ # 服务端渲染的render
│   ├── shared/          # 共享的一些变量、方法等
│   ├── size-check/
│   ├── template-explorer/ 
│   └── vue/             # 入口文件
├── rollup.config.js
├── scripts/   # 源码开发打包的一些配置文件
...
├── test-dts/    # 测试文件
...
├── tsconfig.json
└── yarn.lock
```

## 响应式数据

###  `reactive.ts`文件

它是通过`proxy`的方式将`Object`或`Array`类型的数据处理成响应式数据

1. 对于嵌套对象只有被访问了才会处理成响应式

###  `effect.ts`文件

关联数据对应的操作方法

1. 执行了传递给它的函数，
2. 监听传入的函数，内部有响应式数据使用时，并且发生修改，重新执行

###  `ref.ts`文件

把基本数据类型处理成响应式数据