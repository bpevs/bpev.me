/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { InnerRenderFunction, RenderContext, start } from '$fresh/server.ts'
import manifest from './fresh.gen.ts'
import * as log from '$std/log/mod.ts'

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler('DEBUG'),
  },

  loggers: {
    default: {
      level: 'DEBUG',
      handlers: ['console'],
    },
  },
})

const stylesheet = await Deno.readTextFile('./styles/index.css')
const leafletStyles = await Deno.readTextFile('./styles/leaflet.css')

function render(ctx: RenderContext, innerRender: InnerRenderFunction) {
  innerRender()
  ctx.styles.splice(0, ctx.styles.length, leafletStyles, stylesheet)
}

await start(manifest, { render })
