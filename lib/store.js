
export function createStore (reducer, initialData) {
  let state = initialData
  const listeners = []

  function getState () {
    return state
  }

  function subscribe (l) {
    listeners.push(l)

    return () => listeners.splice(listeners.indexOf(l), 1)
  }

  function dispatch (action) {
    state = reducer(state, action)
    for (let i = 0, l = listeners.length; i < l; i++) {
      listeners[i]()
    }
  }

  return { dispatch, getState, subscribe }
}