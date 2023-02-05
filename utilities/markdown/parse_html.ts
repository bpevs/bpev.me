import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts'

export default function parseMarkup(html: string) {
  let doc, parserError

  // wrap with an element so we can find it after parsing
  const wrappedMarkup = `<!DOCTYPE html><html lang="en">${html}</html>`

  // if available (browser support varies), using DOMPaser in HTML mode is best
  try {
    doc = new DOMParser().parseFromString(wrappedMarkup, 'text/html')
  } catch (err) {
    parserError = err
  }

  if (!doc) return

  // retrieve our wrapper node
  const out = doc.getElementsByTagName('body')[0]
  const fc = out.firstChild

  if (html && !fc) out.error = 'Document parse failed.'

  // pluck out parser errors
  if (fc && String(fc.nodeName).toLowerCase() === 'parsererror') {
    // remove post/preamble to get just the error message as text
    fc.removeChild(fc.firstChild)
    fc.removeChild(fc.lastChild)
    out.error = fc.textContent || fc.nodeValue || parserError ||
      'Unknown error'
    // remove the error from the DOM leaving things nice and tidy
    out.removeChild(fc)
  }

  return out
}
