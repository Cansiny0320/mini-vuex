import ModuleCollection from './module/module-collection.js'
import { resetStoreState, installModule } from './store-util.js'
export function createStore(options) {
  return new Store(options)
}

export class Store {
  constructor(options = {}) {
    const plugins = options.plugins || []
    this._subscribers = []
    this._actionSubscribers = []
    this._actions = Object.create(null)
    this._mutations = Object.create(null)
    this.getters = Object.create(null)

    // 收集 modules
    this._modules = new ModuleCollection(options)

    // 绑定commit 和 dispatch 到自身
    const store = this
    const { dispatch, commit } = this
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit(type, payload) {
      return commit.call(store, type, payload, options)
    }

    const state = this._modules.root.state

    // 安装 module
    installModule(this, state, [], this._modules.root)

    // 初始化 state
    resetStoreState(this, state)

    // 应用插件
    plugins.forEach(plugin => plugin(this))
  }
  get state() {
    return this._state.data
  }

  set state(v) {}

  commit(type, payload) {
    const mutation = { type, payload }
    const entry = this._mutations[type]
    if (!entry) {
      return
    }
    entry(payload)
    this._subscribers.slice().forEach(sub => sub(mutation, this.state))
  }

  dispatch(type, payload) {
    const action = { type, payload }
    const entry = this._actions[type]
    if (!entry) {
      return
    }
    try {
      this._actionSubscribers
        .slice()
        .filter(sub => sub.before)
        .forEach(sub => sub.before(action, this.state))
    } catch (error) {
      console.error(e)
    }

    const result = entry(payload)

    return new Promise((resolve, reject) => {
      result
        .then(res => {
          try {
            this._actionSubscribers
              .filter(sub => sub.after)
              .forEach(sub => sub.after(action, this.state))
          } catch (error) {
            console.error(e)
          }
          resolve(res)
        })
        .catch(error => {
          try {
            this._actionSubscribers
              .filter(sub => sub.error)
              .forEach(sub => sub.error(action, this.state, error))
          } catch (e) {
            console.error(e)
          }
          reject(error)
        })
    })
  }

  subscribe(fn) {
    this._subscribers.push(fn)
  }

  subscribeAction(fn) {
    this._actionSubscribers.push({ before: fn })
  }
}
