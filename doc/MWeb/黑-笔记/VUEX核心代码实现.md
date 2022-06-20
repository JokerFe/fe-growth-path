# VUEX核心代码实现

```js
let Vue
export class Store(){
  constructor(options ={}){
    this._states = options.state || {}
    this._mutations = options.mutations || {}
    this._actions = options.actions || {}
    this.commit.bind(this)
    this.dispatch.bind(this)
    resetVm(this)
  }
  get state(){
    return this._vm.$state
  }
  commit (type,payload){
    let entry = this._mutations(type)
    if(!entry) return;
    entry(this._states,payload)
  }
  dispatch (type,payload){
    let entry = this._actions(type)
    if(!entry) return;
    let context = {
      dispatch:this.dispatch,
      commit:this.commit
    }
    let res = entry(context,payload)
    return isPromise(res)?res:Promise.resolve(res)
  }
}
export function install(_Vue){
  if(Vue&&Vue ===_Vue) return;
  Vue = _Vue
  const init = Vue.prototype._init
  Vue.prorotype._init = function (options={}){
    options.init = options.init?[options.init].concat(vueInit):vueInit
    init.call(this,options)
  }
  function vueInit(){
    const options = this.options
    //对于根节点来说
    if(options.store){
      this.$store = typeof options.store === 'function'?options.store():options.store
    }else if(options.parent&&options.parent.$store){
      this.$store = options.parent.$store
    }
  }
}
function isPromise(val){
  return val && typeof val.then === 'function'
}
function resetVm(store){
  const slient = Vue.config.slient
  Vue.config.slient = false
  store._vm = new Vue({
    data:{
      $$state:store._states
    }
  })
  Vue.config.slient = slient
}
```

