// @ts-nocheck
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts'
let parserDoc

// Parse markup into a DOM using the given mimetype.
export default function parseMarkup(markup: string, type: string) {
  const mime = type === 'html' ? 'text/html' : 'application/xml'

  let doc, parserError, tag, wrappedMarkup

  // wrap with an element so we can find it after parsing, and to support multiple root nodes
  if (type === 'html') {
    tag = 'body'
    wrappedMarkup = `<!DOCTYPE html><html lang="en">${markup}</html>`
  } else {
    tag = 'xml'
    wrappedMarkup = '<?xml version="1.0" encoding="UTF-8"?>\n<xml>' + markup +
      '</xml>'
  }

  // if available (browser support varies), using DOMPaser in HTML mode is much faster, safer and cleaner than injecting HTML into an iframe.
  try {
    doc = new DOMParser().parseFromString(wrappedMarkup, mime)
  } catch (err) {
    parserError = err
  }

  if (!doc) return

  // retrieve our wrapper node
  const out = doc.getElementsByTagName(tag)[0]
  const fc = out.firstChild

  if (markup && !fc) {
    out.error = 'Document parse failed.'
  }

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
