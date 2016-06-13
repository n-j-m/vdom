import { createElement, updateElement } from './element'
import { createStore } from './store'

export function render (component, reducer, mount, initialData) {
  let oldVNode = null
  let node = null

  const store = createStore(reducer, initialData)

  function create (vNode) {
    node = createElement(vNode)
    if (mount) {
      mount.innerHTML = ''
      mount.appendChild(node)
    }
    oldVNode = vNode
  }

  function update (vNode) {
    updateElement(mount, vNode, oldVNode)
    oldVNode = vNode
  }

  function renderer () {
    if (!node) {
      create(component(store.getState(), store.dispatch))
    } else {
      update(component(store.getState(), store.dispatch))
    }
  }

  store.subscribe(renderer)
  renderer()
}
