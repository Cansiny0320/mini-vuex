import Module from './module.js'

export default class ModuleCollection {
  constructor(rawRootModule) {
    this.register([], rawRootModule)
  }

  get(path) {
    return path.reduce((module, key) => {
      return module.getChild(key)
    }, this.root)
  }

  register(path, rawModule) {
    const newModule = new Module(rawModule)
    if (path.length === 0) {
      // root 定义为 rawModule
      this.root = newModule
    } else {
      const parent = this.get(path.slice(0, -1))
      parent.addChild(path[path.length - 1], newModule)
    }

    //  如果传入有 modules，递归地注册子模块
    if (rawModule.modules) {
      Object.keys(rawModule.modules).forEach(key => {
        const rawChildModule = rawModule.modules[key]
        this.register(path.concat(key), rawChildModule)
      })
    }
  }
}
