# 如何实现 webpack 持久化缓存

## 持久化缓存

1. 服务端设置 HTTP 缓存头 (Cache-Contro/等）
2. 打包依赖 (dependencies）和运行时（runtime）到不同 chunk（在 webpack 中，编译后的单独文件称为chunk)，即作 splitChunks，因为它们几乎是不变的。
3. 延迟加载：使用 import（）方式，可以将动态加载的文件分到独立的 chunk，以得到自己的 chunkhash
4. 保证 hash 值稳定：编译过程和文件内容的更改尽量不影响其他文件 hash 的计算。对于低版本 webpack 生成的增量数字 ID 不稳定问题，可用 `HashedModuleIdsPlugin` 基于文件路径生成解决。

 

