import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// 创建Vue实例主函数
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 调用初始化函数 src/core/instance/init.js
  this._init(options)
}

initMixin(Vue)  // 初始化合并
stateMixin(Vue) // 状态合并
eventsMixin(Vue) // 事件合并
lifecycleMixin(Vue) // 声明周期合并
renderMixin(Vue) // 渲染合并

export default Vue
