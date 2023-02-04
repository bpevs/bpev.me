import { h } from "preact"
// @ts-nocheck
const EMPTY_OBJ = {}

// deeply convert an XML DOM to VDOM
export default function toVdom(node, visitor, options) {
  walk.visitor = visitor
  walk.h = h
  walk.options = options || EMPTY_OBJ
  return walk(node)
}

function walk(n, index, arr) {
  if (n.nodeType === 3) {
    return 'textContent' in n ? n.textContent : n.nodeValue || ''
  }
  if (n.nodeType !== 1) return null

  const nodeName = String(n.nodeName).toLowerCase()

  // Do not allow script tags unless explicitly specified
  if (nodeName === 'script' && !walk.options.allowScripts) return null

  const out = walk.h(
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
    if (name.substring(0, 2) === 'on' && walk.options.allowEvents) {
      value = new Function(value) // eslint-disable-line no-new-func
    }
    props[name] = value
  }

  return props
}

function walkChildren(children) {
  let c = [...(children && Array.prototype.map.call(children, walk))]
  return c && c.length ? c : null
}
