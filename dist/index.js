'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.h = h;
exports.createElement = createElement;
exports.updateElement = updateElement;

var _props = require('./props');

function isPrimative(value) {
  var t = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return t === 'string' || t === 'number' || t === 'boolean';
}

function h(type, props) {
  var _ref;

  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    type: type,
    props: props || {},
    children: (_ref = []).concat.apply(_ref, children)
  };
}

function createElement(node) {
  if (isPrimative(node)) {
    return document.createTextNode(node);
  }

  var el = document.createElement(node.type);
  (0, _props.setProps)(el, node.props);
  node.children.map(createElement).forEach(el.appendChild.bind(el));

  return el;
}

function changed(node1, node2) {
  return (typeof node1 === 'undefined' ? 'undefined' : _typeof(node1)) !== (typeof node2 === 'undefined' ? 'undefined' : _typeof(node2)) || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type || node1.props && node1.props.forceUpdate;
}

function updateElement(parent, newNode, oldNode) {
  var index = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

  if (oldNode === null || oldNode === undefined) {
    parent.appendChild(createElement(newNode));
  } else if (newNode === null || newNode === undefined) {
    parent.removeChild(parent.childNodes[index]);
  } else if (changed(newNode, oldNode)) {
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
  } else if (newNode.type) {
    // update props
    (0, _props.updateProps)(parent.childNodes[index], newNode.props, oldNode.props);
    // diff all children
    var newLength = newNode.children.length;
    var oldLength = oldNode.children.length;
    for (var i = 0; i < newLength || i < oldLength; i++) {
      updateElement(parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
    }
  }
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEventProp = isEventProp;
exports.extractEventName = extractEventName;
exports.addEventListeners = addEventListeners;

var eventRe = /^on/;

function isEventProp(prop) {
  return eventRe.test(prop);
}

function extractEventName(prop) {
  return prop.slice(2).toLowerCase();
}

function addEventListeners(target, props) {
  Object.keys(props).forEach(function (prop) {
    if (isEventProp(prop)) {
      target.addEventListener(extractEventName(prop), props[prop]);
    }
  });
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = require('./element');

Object.defineProperty(exports, 'h', {
  enumerable: true,
  get: function get() {
    return _element.h;
  }
});
Object.defineProperty(exports, 'createElement', {
  enumerable: true,
  get: function get() {
    return _element.createElement;
  }
});
Object.defineProperty(exports, 'updateElement', {
  enumerable: true,
  get: function get() {
    return _element.updateElement;
  }
});

var _render = require('./render');

Object.defineProperty(exports, 'render', {
  enumerable: true,
  get: function get() {
    return _render.render;
  }
});
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCustomProp = isCustomProp;
exports.setBooleanProp = setBooleanProp;
exports.removeBooleanProp = removeBooleanProp;
exports.setProp = setProp;
exports.removeProp = removeProp;
exports.setProps = setProps;
exports.updateProp = updateProp;
exports.updateProps = updateProps;
function isCustomProp(prop) {
  return prop === 'forceUpdate';
}

function setBooleanProp(target, prop, value) {
  if (value) {
    target.setAttribute(prop, value);
    target[prop] = true;
  } else {
    target[prop] = false;
  }
}

function removeBooleanProp(target, prop) {
  target.removeAttribute(prop);
  target[prop] = false;
}

function setProp(target, prop, value) {
  if (isCustomProp(prop)) {
    return;
  } else if (prop === 'className') {
    target.setAttribute('class', value);
  } else if (typeof value === 'boolean') {
    setBooleanProp(target, prop, value);
  } else {
    if (prop === 'style' || target[prop] == null && typeof value !== 'function') {
      target.setAttribute(prop, value);
    } else {
      target[prop] = value;
    }
  }
}

function removeProp(target, prop, value) {
  if (isCustomProp(prop)) {
    return;
  } else if (prop === 'className') {
    target.removeAttribute('class');
  } else if (typeof value === 'boolean') {
    removeBooleanProp(target, prop);
  } else {
    target.removeAttribute(prop);
  }
}

function setProps(target, props) {
  Object.keys(props).forEach(function (prop) {
    return setProp(target, prop, props[prop]);
  });
}

function updateProp(target, prop, newValue, oldValue) {
  if (!newValue) {
    removeProp(target, prop, oldValue);
  } else if (!oldValue || newValue !== oldValue) {
    setProp(target, prop, newValue);
  }
}

function updateProps(target, newProps) {
  var oldProps = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var props = Object.assign({}, newProps, oldProps);
  Object.keys(props).forEach(function (prop) {
    return updateProp(target, prop, newProps[prop], oldProps[prop]);
  });
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;

var _element = require('./element');

var _store = require('./store');

function render(component, reducer, mount, initialData) {
  var oldVNode = null;
  var node = null;

  var store = (0, _store.createStore)(reducer, initialData);

  function create(vNode) {
    node = (0, _element.createElement)(vNode);
    if (mount) {
      mount.innerHTML = '';
      mount.appendChild(node);
    }
    oldVNode = vNode;
  }

  function update(vNode) {
    (0, _element.updateElement)(mount, vNode, oldVNode);
    oldVNode = vNode;
  }

  function renderer() {
    if (!node) {
      create(component(store.getState(), store.dispatch));
    } else {
      update(component(store.getState(), store.dispatch));
    }
  }

  store.subscribe(renderer);
  renderer();
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = createStore;
function createStore(reducer, initialData) {
  var state = initialData;
  var listeners = [];

  function getState() {
    return state;
  }

  function subscribe(l) {
    listeners.push(l);

    return function () {
      return listeners.splice(listeners.indexOf(l), 1);
    };
  }

  function dispatch(action) {
    state = reducer(state, action);
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i]();
    }
  }

  return { dispatch: dispatch, getState: getState, subscribe: subscribe };
}
