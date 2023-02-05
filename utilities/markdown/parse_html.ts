import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts'

export default function parseMarkup(html: string): Node | null {
  // wrap with an element so we can find it after parsing
  const wrappedMarkup = `<!DOCTYPE html><html lang="en">${html}</html>`

  // if available (browser support varies), using DOMPaser in HTML mode is best
  const doc = new DOMParser().parseFromString(wrappedMarkup, 'text/html')
  if (doc == null) return null
  // The Element type provided by deno_dom is sus
  return (doc.getElementsByTagName('body')[0] as unknown as Node) || null
}
