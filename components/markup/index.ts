// @ts-nocheck
// Adapted from: https://github.com/developit/preact-markup

import {
  Component,
  ComponentConstructor,
  createElement,
  FunctionalComponent,
  h,
  VNode,
} from 'preact'
import markupToVdom from './markup_to_vdom.ts'
import { render } from './gfm.ts'

type Components = Record<
  string,
  ComponentConstructor<any, any> | FunctionalComponent<any>
>

type Props = {
  type?: string
  trim?: boolean
  wrap?: boolean
  reviver?: typeof createElement
  markup: string
  components?: Components
  onError?: (error: { error: Error }) => void
  'allow-scripts'?: boolean
  'allow-events'?: boolean
  [key: string]: any
}

let customReviver

export default class Markup extends Component<Props, {}> {
  static setReviver(customH: typeof createElement): void {
    customReviver = customH
  }

  shouldComponentUpdate({ wrap, type, markup }) {
    let p = this.props
    return wrap !== p.wrap || type !== p.type || markup !== p.markup
  }

  setComponents(components: Components): void {
    this.map = {}
    if (components) {
      for (let i in components) {
        // eslint-disable-next-line no-prototype-builtins
        if (components.hasOwnProperty(i)) {
          let name = i.replace(
            /([A-Z]+)([A-Z][a-z0-9])|([a-z0-9]+)([A-Z])/g,
            '$1$3-$2$4',
          ).toLowerCase()
          this.map[name] = components[i]
        }
      }
    }
  }

  render(
    {
      wrap = true,
      type,
      markup,
      components,
      reviver,
      onError,
      'allow-scripts': allowScripts,
      'allow-events': allowEvents,
      ...props
    }: props,
    {},
  ): VNode {
    const markupHTML = render(markup)
    const options = { allowScripts, allowEvents }
    const customH = reviver || this.reviver ||
      this.constructor.prototype.reviver ||
      customReviver || h
    let vdom

    this.setComponents(components)

    try {
      vdom = markupToVdom(markupHTML, type, customH, this.map, options)
    } catch (error) {
      if (onError) onError({ error })
      else if (console?.error) console.error(`preact-markup: ${error}`)
    }

    if (!wrap) return vdom || null

    const c = props.hasOwnProperty('className') ? 'className' : 'class'
    let className = props[c]
    if (!className) props[c] = 'markup'
    else if (className.splice) className.splice(0, 0, 'markup')
    else if (typeof className === 'string') props[c] += ' markup'
    else if (typeof className === 'object') className.markup = true

    return customH('div', props, vdom || null)
  }
}
