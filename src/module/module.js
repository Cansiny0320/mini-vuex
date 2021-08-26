export default class Module {
  constructor(rawModule) {
    this._rawModule = rawModule
    this._children = Object.create(null)
    const rawState = rawModule.state
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
  }
  getChild(key) {
    return this._children[key]
  }

  addChild(key, module) {
    this._children[key] = module
  }
}
