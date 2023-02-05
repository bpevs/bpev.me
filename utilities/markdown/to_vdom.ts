// @ts-nocheck
import { h } from 'preact'
const EMPTY_OBJ = {}
const allowScripts = false
const allowEvents = false

// deeply convert an XML DOM to VDOM
export default function toVdom(node, visitor, options) {
  walk.visitor = visitor
  walk.options = options || EMPTY_OBJ
  const nodes = walk(node)
  return nodes
}

function walk(n, index, arr) {
  if (n.nodeType === 3) {
    return 'textContent' in n ? n.textContent : n.nodeValue || ''
  }
  if (n.nodeType !== 1) return null
  const nodeName = String(n.nodeName).toLowerCase()

  // Do not allow script tags unless explicitly specified
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
