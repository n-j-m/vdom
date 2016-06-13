
export function isCustomProp (prop) {
  return prop === 'forceUpdate'
}

export function setBooleanProp (target, prop, value) {
  if (value) {
    target.setAttribute(prop, value)
    target[prop] = true
  } else {
    target[prop] = false
  }
}

export function removeBooleanProp (target, prop) {
  target.removeAttribute(prop)
  target[prop] = false
}

export function setProp (target, prop, value) {
  if (isCustomProp(prop)) {
    return
  } else if (prop === 'className') {
    target.setAttribute('class', value)
  } else if (typeof value === 'boolean') {
    setBooleanProp(target, prop, value)
  } else {
    if (prop === 'style' || (target[prop] == null && typeof value !== 'function')) {
      target.setAttribute(prop, value)
    } else {
      target[prop] = value
    }
  }
}

export function removeProp (target, prop, value) {
  if (isCustomProp(prop)) {
    return
  } else if (prop === 'className') {
    target.removeAttribute('class')
  } else if (typeof value === 'boolean') {
    removeBooleanProp(target, prop)
  } else {
    target.removeAttribute(prop)
  }
}

export function setProps (target, props) {
  Object.keys(props)
    .forEach(prop => setProp(target, prop, props[prop]))
}

export function updateProp (target, prop, newValue, oldValue) {
  if (!newValue) {
    removeProp(target, prop, oldValue)
  } else if (!oldValue || newValue !== oldValue) {
    setProp(target, prop, newValue)
  }
}

export function updateProps (target, newProps, oldProps = {}) {
  const props = Object.assign({}, newProps, oldProps)
  Object.keys(props)
    .forEach(prop => updateProp(target, prop, newProps[prop], oldProps[prop]))
}
