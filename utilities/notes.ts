import { extract } from '$std/front_matter/any.ts'
import { join } from '$std/path/mod.ts'
import { markdownToHtml, markdownToPlaintext } from 'parsedown'

import {
  B2_BLOG_BUCKET_ID,
  BLOG_ROOT,
  FEATURE,
  URL_BLOG_LOCAL,
} from '@/constants.ts'
import * as b2 from '@/utilities/b2.ts'
import store from '@/utilities/store.ts'
import { ImageMeta } from '@/utilities/photo_constants.ts'

export async function deleteCachedNote(slug) {
  if (!FEATURE.CACHE) return
  await store.delete(['notes', slug])
}

export async function deleteAllCachedNotes() {
  if (!FEATURE.CACHE) return
  await store.delete(['notes'])
}

export async function setCachedNote(slug, note) {
  if (!FEATURE.CACHE) return
  await store.set(['notes', slug], note)
}

export async function getCachedNote(slug: string) {
  if (!FEATURE.CACHE) return null
  if (!slug) return null
  return (await store.get(['notes', slug])).value
}

export interface Note {
  slug: string
  title: string
  published?: Date | null
  updated?: Date
  lastChecked?: number
  images?: {
    [slug: string]: {
      [imageSlug: string]: {
        [size: string]: ImageMeta
      }
    }
  }
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

const ONE_WEEK = 8.64e+7 * 7
export async function getNote(slug: string): Promise<Note | null> {
  let { composite, lastChecked } = (await getCachedNote(slug)) || {}

  if (!composite || ((Date.now() - (lastChecked ?? 0)) > ONE_WEEK)) {
    console.log('Fetching Note: ', slug)
    try {
      let filePath = ''
      if (FEATURE.B2) {
        if (BLOG_ROOT) filePath = join(BLOG_ROOT, slug + '.md')
        else throw new Error('no BLOG_ROOT')
        const response = await fetch(filePath)
        composite = await response.text()
      } else {
        if (URL_BLOG_LOCAL) filePath = join(URL_BLOG_LOCAL, slug + '.md')
        else throw new Error('no URL_BLOG_LOCAL')
        const response = await Deno.readFile(filePath)
        composite = new TextDecoder('utf-8').decode(response)
      }

      if (composite) {
        console.log('Caching Note: ', slug)
        await setCachedNote(slug, {
          composite,
          lastChecked: Date.now(),
        })
      }
    } catch (e) {
      console.log(`Invalid Note! `, slug)
      console.error(e)
    }
  } else {
    console.log('Using Cached Note: ', slug)
  }

  if (!composite) return null

  return parseNote(slug, composite)
}

async function parseNote(slug, composite: string): Promise<Note | null> {
  const { attrs, body: commonmark } = extract(composite)
  const [text, { html }] = await Promise.all([
    markdownToPlaintext(commonmark),
    markdownToHtml(commonmark),
  ])

  const images = {}
  imageInfoKeys.filter((key) => key.includes(slug)).forEach((key) => {
    images[key] = imageInfo[key]
  })

  return {
    slug,
    title: String(attrs?.title),
    published: new Date(attrs?.published as string),
    updated: new Date(attrs?.updated as string),
    content: { commonmark, html, text },
    images,
  }
}

export async function postNote(note: Note): Promise<void> {
  if (!B2_BLOG_BUCKET_ID) throw new Error('No Blog Bucket ID')

  const body = new TextEncoder().encode(
    '---\n' +
      `published: ${note.published}\n` +
      `title: "${note.title}"\n` +
      '---\n' +
      note.content.commonmark,
  )
  const result = await b2.uploadFile(
    B2_BLOG_BUCKET_ID,
    `${note.slug}.md`,
    body,
    { 'Content-Type': 'text/markdown' },
  )
  await deleteCachedNote(note.slug)
  await setCachedNote(note.slug, note)
  return result
}
