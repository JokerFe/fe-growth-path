/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

let uid = 0

/**
 * A dep is an observable that can have multiple directives subscribing to it.
 * dep是一个观察者，可以被多个指令订阅它
 * @property {target} watcher实例
 * @property {id} id
 * @property {subs} 依赖数组 存放订阅者
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  // 初始化
  constructor () {
    this.id = uid++
    this.subs = []
  }
  // 添加订阅者
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
  // 删除订阅者
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }
  // 依赖 
  depend () {
    // Dep.target === watcher
    if (Dep.target) {
      // 链接 ./wather.js ☞ addDep
      Dep.target.addDep(this)
    }
  }
  // 通知
  notify () {
    // stabilize the subscriber list first
    // 首先获取sub数组
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async we need to sort them now to make sure they fire in correct order
      // 如果不运行异步我们需要对它们进行排序，以确保它们按正确的执行顺序，那么子系统在调度程序中是不排序的。
      subs.sort((a, b) => a.id - b.id)
    }
    // 遍历sub数组，逐个调用数组元素watcher实例的update方法
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null
const targetStack = []

export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
