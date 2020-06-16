export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  // 如果是版本号大于2 直接将vuexInit初始化方法混入到beforeCreate生命周期中
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // 重写init并注入Vuex初始化过程  向后兼容
    // for 1.x backwards compatibility.

    // 重写vue的_init方法，获取到原来的配合，如果options.init存在则通过concat的方式将init进行合并，否则直接使用vuex的init方法，最后直接调用vue原来的_init方法进行进行初始化
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   * Vuex 初始化钩子，注入每个实例初始化钩子列表
   * 此方法内的this执行vue的实例，将store挂载到vue.$store
   */

  function vuexInit () {
    const options = this.$options
    // store injection

    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
