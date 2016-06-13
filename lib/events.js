
const eventRe = /^on/

export function isEventProp (prop) {
  return eventRe.test(prop)
}

export function extractEventName (prop) {
  return prop.slice(2).toLowerCase()
}

export function addEventListeners (target, props) {
  Object.keys(props).forEach(prop => {
    if (isEventProp(prop)) {
      target.addEventListener(
        extractEventName(prop),
        props[prop]
      )
    }
  })
}
