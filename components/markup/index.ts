import {
  Component,
  ComponentConstructor,
  createElement,
  FunctionalComponent,
  h,
  VNode,
} from "preact";
import markupToVdom from "./markup_to_vdom.ts";

type Components = Record<
  string,
  ComponentConstructor<any, any> | FunctionalComponent<any>
>;

type Props = {
  type?: string;
  trim?: boolean;
  wrap?: boolean;
  reviver?: typeof createElement;
  markup: string;
  components?: Components;
  onError?: (error: { error: Error }) => void;
  "allow-scripts"?: boolean;
  "allow-events"?: booleanan;
  [key: string]: any;
};

let customReviver;

export default class Markup extends Component<Props, {}> {
  static setReviver(customH: typeof createElement): void {
    customReviver = customH;
  }

  shouldComponentUpdate({ wrap, type, markup }) {
    let p = this.props;
    return wrap !== p.wrap || type !== p.type || markup !== p.markup;
  }

  setComponents(components: Components): void {
    this.map = {};
    if (components) {
      for (let i in components) {
        // eslint-disable-next-line no-prototype-builtins
        if (components.hasOwnProperty(i)) {
          let name = i.replace(
            /([A-Z]+)([A-Z][a-z0-9])|([a-z0-9]+)([A-Z])/g,
            "$1$3-$2$4",
          ).toLowerCase();
          this.map[name] = components[i];
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
      "allow-scripts": allowScripts,
      "allow-events": allowEvents,
      trim,
      ...props
    }: props,
    {},
  ): VNode {
    const options = { allowScripts, allowEvents, trim };
    const customH = reviver || this.reviver ||
      this.constructor.prototype.reviver ||
      customReviver || h;
    let vdom;

    this.setComponents(components);

    try {
      vdom = markupToVdom(markup, type, customH, this.map, options);
    } catch (error) {
      if (onError) onError({ error });
      else if (console?.error) console.error(`preact-markup: ${error}`);
    }

    if (!wrap) return vdom || null;

    const c = props.hasOwnProperty("className") ? "className" : "class";
    const cl = props[c];
    if (!cl) props[c] = "markup";
    else if (cl.splice) cl.splice(0, 0, "markup");
    else if (typeof cl === "string") props[c] += " markup";
    else if (typeof cl === "object") cl.markup = true;

    return customH("div", props, vdom || null);
  }
}
