import { extract } from '$std/front_matter/any.ts'
import { join } from '$std/path/mod.ts'
import { markdownToHtml, markdownToPlaintext } from 'parsedown'
import * as cheerio from 'cheerio'

import { BLOG_ROOT, FEATURE, URL_BLOG_LOCAL, URL_STATIC } from '@/config.ts'
import * as b2 from '@/utilities/b2.ts'

const { FAST, NORMAL, DETAILED } = Object.freeze({
  FAST: 'FAST',
  NORMAL: 'NORMAL',
  DETAILED: 'DETAILED',
})

const root: { [type: string]: string } = Object.freeze({
  [FAST]: `${URL_STATIC}cache/fast/`,
  [NORMAL]: `${URL_STATIC}cache/normal/`,
  [DETAILED]: `${URL_STATIC}cache/detailed/`,
  ORIGINAL: `${URL_STATIC}`,
})

export interface ImageMeta {
  averageColor: [number, number, number, number]
  height: number
  width: number
}

export interface ImageMetaMap {
  [imageSlug: string]: {
    [size: string]: ImageMeta
  }
}

export interface Note {
  slug: string
  title: string
  published?: Date | null
  updated?: Date
  lastChecked?: number
  images?: ImageMetaMap
  content: {
    commonmark: string
    html?: string
    text?: string
  }
}

const IMAGE_DATA_URL = 'https://static.bpev.me/cache/image_data.json'

// Pre-cache info
const imageInfo = await fetch(IMAGE_DATA_URL).then((r) => r.json())
const imageInfoKeys = Object.keys(imageInfo)

export async function getNotes(): Promise<Note[]> {
  const notes$ = []
  if (FEATURE.B2) {
    for (const { fileName, contentType } of await b2.listNotes()) {
      if (contentType === 'text/markdown' || /\.md$/i.test(fileName)) {
        notes$.push(getNote(fileName.replace(/\.md$/i, '')))
      }
    }
  } else {
    if (URL_BLOG_LOCAL) {
      for await (const dirEntry of Deno.readDir(URL_BLOG_LOCAL)) {
        notes$.push(getNote(dirEntry.name.replace(/\.md$/, '')))
      }
    } else throw new Error('No URL_BLOG_LOCAL')
  }

  const notes = (await Promise.all(notes$)).filter(Boolean) as Note[]
  notes.sort((a, b) => {
    if (a?.published == null) return -1
    else if (b?.published == null) return 1
    else return b.published.getTime() - a.published.getTime()
  })

  return notes
}

export async function getNote(id: string): Promise<Note | null> {
  let composite
  console.log('Fetching Note: ', id)
  try {
    let filePath = ''
    if (FEATURE.B2) {
      if (BLOG_ROOT) filePath = join(BLOG_ROOT, id + '.md')
      else throw new Error('no BLOG_ROOT')
      composite = await (await fetch(filePath)).text()
    } else {
      if (URL_BLOG_LOCAL) filePath = join(URL_BLOG_LOCAL, id + '.md')
      else throw new Error('no URL_BLOG_LOCAL')
      composite = new TextDecoder('utf-8').decode(await Deno.readFile(filePath))
    }
  } catch (e) {
    console.log(`Invalid Note! `, id)
    console.error(e)
  }

  if (!composite) return null

  return parseNote(id, composite)
}

export async function parseNote(
  id: string,
  composite: string,
): Promise<Note | null> {
  console.log('Parsing Note: ', id)
  try {
    const images: ImageMetaMap = {}
    imageInfoKeys
      .filter((key: string) => key.includes(id))
      .forEach((key: string) => {
        if (key) images[key] = imageInfo[key]
      })

    const { attrs, body: commonmark } = extract(composite)
    const [text, html] = await Promise.all([
      markdownToPlaintext(commonmark),
      decorateHTML(await markdownToHtml(commonmark), id, images),
    ])

    return {
      slug: id,
      title: String(attrs?.title),
      published: new Date(attrs?.published as string),
      updated: new Date(attrs?.updated as string),
      content: { commonmark, html, text },
      images,
    }
  } catch (e) {
    console.log(e)
    console.log(id)
    return null
  }
}

function decorateHTML(
  // deno-lint-ignore no-explicit-any
  { html }: any,
  id: string,
  images: ImageMetaMap,
): string {
  if (!html) return ''
  const $ = cheerio.load(html)

  $('Photo').each((_i, el) => {
    const src = $(el).attr('src')
    if (!src) return
    const notePath = (id == 'projects/') ? id : `notes/${id}/`

    const [name, unformattedExt] = src.split('.')
    const ext = unformattedExt.toLowerCase()
    const upgradedExt = 'webp'
    const imageMeta = images?.[notePath + name + '.' + ext]

    const size = imageMeta?.NORMAL
    const [r, g, b, a] = size?.averageColor || [0, 0, 0, 0.5]
    const averageColor = `rgba(${r}, ${g}, ${b}, ${a})`
    const isPortrait = size?.height > size?.width
    const displayWidth = isPortrait ? 'auto' : (size?.width + 'px')
    const displayHeight = isPortrait ? (size?.height + 'px') : 'auto'

    $(el).replaceWith(`
      <div class='md-island'>
        <a
          href=${root[NORMAL] + notePath + name + '.' + upgradedExt}
          style='text-align: center; display: block'
        >
          <picture
            style='max-height: 600px;'
            height=${size?.height}
            width=${size?.width}
          >
            <source
              srcset=${root[NORMAL] + notePath + name + '.' + upgradedExt}
              type='image/webp'
              media='(min-width:650px)'
              height=${size?.height}
              width=${size?.width}
            />
            <source
              srcset=${root[NORMAL] + notePath + name + '.' + ext}
              type='image/${ext}'
              media='(min-width:650px)'
              height=${size?.height}
              width=${size?.width}
            />
            <source
              srcset=${root[FAST] + notePath + name + '.' + upgradedExt}
              type='image/webp'
              height=${imageMeta?.FAST?.height}
              width=${imageMeta?.FAST?.width}
            />
            <source
              srcset=${root[FAST] + notePath + name + '.' + ext}
              type='image/${ext}'
              height=${imageMeta?.FAST?.height}
              width=${imageMeta?.FAST?.width}
            />
            <img
              class='note-image'
              style='width: ${displayWidth}; height: ${displayHeight}; background-color: ${averageColor};'
              src=${root[FAST] + notePath + name + '.' + upgradedExt}
              height=${size?.height}
              width=${size?.width}
              loading='eager'
              onerror='this.onerror=null;this.src=${
      root[NORMAL] + notePath + name + '.' + ext
    };'
            >
            </img>
          </picture>
        </a>
      </div>
    `)
  })
  return $.html() || ''
}
