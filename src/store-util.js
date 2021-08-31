import { reactive } from '../node_modules/@vue/reactivity/dist/reactivity.esm-browser.js'

export function resetStoreState(store, state) {
  store._state = reactive({
    data: state,
  })
}

export function installModule(store, rootState, path, module) {
  const isRoot = !path.length
  if (!isRoot) {
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    parentState[moduleName] = module.state
  }
  if (module._rawModule.mutations) {
    Object.keys(module._rawModule.mutations).forEach(key => {
      const mutation = module._rawModule.mutations[key]
      store._mutations[key] = payload =>
        // 惰性获取 state
        mutation.call(store, getNestedState(store.state, path), payload)
    })
  }
  if (module._rawModule.actions) {
    Object.keys(module._rawModule.actions).forEach(key => {
      const action = module._rawModule.actions[key]
      store._actions[key] = payload => {
        let res = action.call(
          store,
          {
            dispatch: store.dispatch,
            commit: store.commit,
            getters: store.getters,
            state: store.state,
          },
          payload
        )
        if (!(res instanceof Promise)) {
          res = Promise.resolve(res)
        }
        return res
      }
    })
  }
  if (module._rawModule.getters) {
    Object.keys(module._rawModule.getters).forEach(key => {
      const getter = module._rawModule.getters[key]
      store.getters[key] = () =>
        // 惰性获取 state
        getter(getNestedState(store.state, path), store.getters)
    })
  }
  Object.keys(module._children).forEach(key =>
    installModule(store, rootState, path.concat(key), module._children[key])
  )
}

export function getNestedState(state, path) {
  return path.reduce((state, key) => state[key], state)
}
