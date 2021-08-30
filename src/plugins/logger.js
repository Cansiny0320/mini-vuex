export const logger = store => {
  let prevState = deepClone(store.state)

  store.subscribe((mutation, state) => {
    const nextState = deepClone(state)

    const formattedTime = getFormattedTime()
    const message = `${mutation.type}${formattedTime}`
    console.log('%c prev state', 'color: #9E9E9E; font-weight: bold', prevState)
    console.log('%c mutation', 'color: #03A9F4; font-weight: bold', message)
    console.log('%c next state', 'color: #4CAF50; font-weight: bold', nextState)

    prevState = nextState
  })
}

function getFormattedTime() {
  const time = new Date()
  return ` @ ${time.getHours().toString().padStart(2, '0')}:${time
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}.${time
    .getMilliseconds()
    .toString()
    .padStart(2, '0')}`
}

function deepClone(target, map = new Map()) {
  if (target instanceof Object) {
    let cloneTarget = target instanceof Array ? [] : {}
    if (map.get(target)) {
      return map.get(target)
    }
    map.set(target, cloneTarget)
    for (const key in target) {
      cloneTarget[key] = deepClone(target[key], map)
    }
    return cloneTarget
  } else {
    return target
  }
}
