// @ts-nocheck
import { VNode } from 'preact'

import parseMarkup from './parse_markup.ts'
import toVdom from './to_vdom.ts'

const EMPTY_OBJ = {}

// Convert markup into a virtual DOM.
export default function markupToVdom(
  markup: string, // HTML or XML markup (indicate via `type`)
  type: string, // [type=xml]  A type to use when parsing `markup`. Either `xml` or `html`.
  reviver: (...args: any[]) => any, // The JSX/hyperscript reviver (`h` function) to use. For example, Preact's `h` or `ReactDOM.createElement`.
  map?: { [name: string]: VNode }, // Optional map of custom element names to Components or variant element names.
  options?: { allowEvents: boolean; allowScripts },
) {
  const dom = parseMarkup(markup, type)
  if (dom?.error) throw new Error(dom.error)

  const body = dom?.body || dom
  visitor.map = map || EMPTY_OBJ
  const vdom = body && toVdom(body, visitor, reviver, options)
  visitor.map = null

  return vdom?.props?.children || null
}

function toCamelCase(name) {
  return name.replace(/-(.)/g, (match, letter) => letter.toUpperCase())
}

function visitor(node) {
  const name = (node.type || '').toLowerCase()
  const map = visitor.map

  // eslint-disable-next-line no-prototype-builtins
  if (map && map.hasOwnProperty(name)) {
    node.type = map[name]
    node.props = Object.keys(node.props || {}).reduce((attrs, attrName) => {
      attrs[toCamelCase(attrName)] = node.props[attrName]
      return attrs
    }, {})
  } else {
    node.type = name.replace(/[^a-z0-9-]/i, '')
  }
}
