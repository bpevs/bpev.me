import { ComponentType, h, VNode } from 'preact'
import parseHTML from './parse_html.ts'

const EMPTY_OBJ = {}
const allowScripts = false

// Node, but with possibl VNode props
interface ExtendedNode extends Node {
  // deno-lint-ignore no-explicit-any
  type?: string | ComponentType<any>
  props?: Props
  attributes?: NamedNodeMap
}

export type ComponentsMap = {
  // deno-lint-ignore no-explicit-any
  [name: string]: (...args: any[]) => VNode<any>
}

interface Visitor {
  // deno-lint-ignore no-explicit-any
  (node: VNode<any>): void
  map: ComponentsMap | null
}

interface Walk {
  (node: Node): VNode<unknown> | null
  visitor: Visitor
}

interface Props {
  // deno-lint-ignore no-explicit-any
  [name: string]: any
}

// deno-lint-ignore no-explicit-any
const visitor: Visitor = Object.assign((node: VNode<any>): void => {
  const name = (typeof node.type === 'string' ? node.type : '').toLowerCase()
  const map = visitor.map
  if (map?.hasOwnProperty(name)) {
    node.type = map[name]
    node.props = Object.keys(node.props || {}).reduce((attrs, attrName) => {
      attrs[toCamelCase(attrName)] = node.props?.[attrName]
      return attrs
    }, {} as Props)
  } else {
    node.type = name.replace(/[^a-z0-9-]/i, '')
  }
}, { map: {} })

// Convert html into a virtual DOM.
export default function markupToVdom(
  html: string,
  customElements?: ComponentsMap,
) {
  const body = parseHTML(html)
  visitor.map = customElements || EMPTY_OBJ
  const vdom = body && toVdom(body, visitor)
  visitor.map = null

  return vdom?.props?.children || null
}

function toCamelCase(name: string): string {
  return name.replace(/-(.)/g, (_, letter) => letter.toUpperCase())
}

const TEXT_NODE = 3
const ELEMENT_NODE = 1
const walk: Walk = Object.assign((n: ExtendedNode): VNode<unknown> | null => {
  if (n.nodeType === TEXT_NODE) {
    return ('textContent' in n) ? n.textContent : n.nodeValue || ''
  }
  if (n.nodeType !== ELEMENT_NODE) return null
  const nodeName = String(n.nodeName).toLowerCase()

  if (nodeName === 'script' && !allowScripts) return null

  const out = h(
    nodeName,
    getProps(n.attributes),
    walkChildren(n.childNodes),
  )

  if (walk.visitor) walk.visitor(out)

  return out
}, {
  visitor,
})

// deeply convert an XML DOM to VDOM
function toVdom(node: Node, visitor: Visitor): VNode<unknown> | null {
  walk.visitor = visitor
  return walk(node)
}

function getProps(attrs?: NamedNodeMap) {
  if (!attrs?.length) return null
  const props: Props = {}
  Array.from(attrs).forEach(({ name, value }) => props[name] = value)
  return props
}

function walkChildren(toWalk: NodeList): Array<VNode<unknown> | null> | null {
  const children = Array.from(toWalk).map(walk)
  return children?.length ? children : null
}

export function createComponentMap(components: ComponentsMap): ComponentsMap {
  const exportComponents = { ...components }
  for (const componentName in components) {
    const name = componentName.replace(
      /([A-Z]+)([A-Z][a-z0-9])|([a-z0-9]+)([A-Z])/g,
      '$1$3-$2$4',
    ).toLowerCase()
    exportComponents[name] = components[componentName]
  }
  return exportComponents
}
