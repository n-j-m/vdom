import { setProps, updateProps } from './props'

function isPrimative (value) {
  const t = typeof value
  return t === 'string' || t === 'number' || t === 'boolean'
}

export function h (type, props, ...children) {
  return {
    type,
    props: props || {},
    children: [].concat(...children)
  }
}

export function createElement (node) {
  if (isPrimative(node)) {
    return document.createTextNode(node)
  }

  const el = document.createElement(node.type)
  setProps(el, node.props)
  node.children
    .map(createElement)
    .forEach(el.appendChild.bind(el))

  return el
}

function changed (node1, node2) {
  return typeof node1 !== typeof node2 ||
    typeof node1 === 'string' && node1 !== node2 ||
    node1.type !== node2.type ||
    node1.props && node1.props.forceUpdate
}

export function updateElement (parent, newNode, oldNode, index = 0) {
  if (oldNode === null || oldNode === undefined) {
    parent.appendChild(
      createElement(newNode)
    )
  } else if (newNode === null || newNode === undefined) {
    parent.removeChild(
      parent.childNodes[index]
    )
  } else if (changed(newNode, oldNode)) {
    parent.replaceChild(
      createElement(newNode),
      parent.childNodes[index]
    )
  } else if (newNode.type) {
    // update props
    updateProps(
      parent.childNodes[index],
      newNode.props,
      oldNode.props
    )
    // diff all children
    const newLength = newNode.children.length
    const oldLength = oldNode.children.length
    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(
        parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      )
    }
  }
}
