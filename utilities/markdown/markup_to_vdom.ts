import { h, VNode } from 'preact'
import parseHTML from './parse_html.ts'

const EMPTY_OBJ = {}
const allowScripts = false
const allowEvents = false

// Convert html into a virtual DOM.
export default function markupToVdom(
  html: string,
  customElements?: { [name: string]: VNode },
) {
  const dom = parseHTML(html)
  if (dom?.error) throw new Error(dom.error)

  const body = dom?.body || dom
  visitor.map = customElements || EMPTY_OBJ
  const vdom = body && toVdom(body, visitor)
  visitor.map = null

  return vdom?.props?.children || null
}

function toCamelCase(name) {
  return name.replace(/-(.)/g, (_, letter) => letter.toUpperCase())
}

function visitor(node) {
  const name = (node.type || '').toLowerCase()
  const map = visitor.map
  if (map?.hasOwnProperty(name)) {
    node.type = map[name]
    node.props = Object.keys(node.props || {}).reduce((attrs, attrName) => {
      attrs[toCamelCase(attrName)] = node.props[attrName]
      return attrs
    }, {})
  } else {
    node.type = name.replace(/[^a-z0-9-]/i, '')
  }
}

// deeply convert an XML DOM to VDOM
function toVdom(node, visitor, options) {
  walk.visitor = visitor
  walk.options = options || EMPTY_OBJ
  const nodes = walk(node)
  return nodes
}

function walk(n) {
  if (n.nodeType === 3) {
    return 'textContent' in n ? n.textContent : n.nodeValue || ''
  }
  if (n.nodeType !== 1) return null
  const nodeName = String(n.nodeName).toLowerCase()

  if (nodeName === 'script' && !allowScripts) return null

  const out = h(
    nodeName,
    getProps(n.attributes),
    walkChildren(n.childNodes),
  )

  if (walk.visitor) walk.visitor(out)

  return out
}

function getProps(attrs) {
  const len = attrs?.length
  if (!len) return null

  const props = {}
  for (let i = 0; i < len; i++) {
    let { name, value } = attrs[i]
    if (name.substring(0, 2) === 'on' && allowEvents) {
      value = new Function(value)
    }
    props[name] = value
  }

  return props
}

function walkChildren(toWalk) {
  const children = Array.from(toWalk).map(walk)
  return children?.length ? children : null
}
