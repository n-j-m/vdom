/** @jsx h */
/* eslint-disable jsx-quotes */
import { h, render } from 'vdom'

import './plugins.min.css'
import './main.css'

let _id = 0
function getId () {
  return _id++
}

function map (obj, fun) {
  let i = 0
  const ret = Object.keys(obj).reduce((arr, key) => {
    arr.push(fun(obj[key], key, i++))
    return arr
  }, [])
  return ret
}

function counter (state, action) {
  switch (action.type) {
    case 'ADD_COUNTER':
      return { count: 0 }
    case 'INCREMENT':
      return { count: state.count + 1 }
    case 'DECREMENT':
      return { count: state.count - 1 }
    default:
      return state
  }
}

function countersReducer (state, action) {
  switch (action.type) {
    case 'ADD_COUNTER':
      return {
        counters: {
          ...state.counters,
          [getId()]: counter(undefined, action)
        }
      }
    case 'REMOVE_COUNTER':
      delete state.counters[action.id]
      return {
        counters: { ...state.counters }
      }
    case 'INCREMENT':
    case 'DECREMENT':
      return {
        counters: {
          ...state.counters,
          [action.id]: counter(state.counters[action.id], action)
        }
      }
    default:
      return state
  }
}

function CounterList (props, dispatch) {
  const counterList = (
    <div>
      <div class="list-controls">
        <h1> Counter List</h1>
        <button onclick={() => dispatch({type: 'ADD_COUNTER'})}>Add Counter</button>
      </div>
      <div className="list">
        {map(props.counters, (counter, key) => Counter({id: key, ...counter}, dispatch))}
      </div>
    </div>
  )
  return counterList
}

function Counter (props, dispatch) {
  const cls = `list-item ${props.id}`
  const counter = (
    <div className={cls}>
      <h1>Count: {props.count + ''}</h1>
      <button onclick={() => dispatch({type: 'DECREMENT', id: props.id})}>-</button>
      <button onclick={() => dispatch({type: 'INCREMENT', id: props.id})}>+</button>
      <button onclick={() => dispatch({type: 'REMOVE_COUNTER', id: props.id})}>&times;</button>
    </div>
  )
  return counter
}

render(CounterList, countersReducer, document.getElementById('root'), { counters: {} })
