import { extract } from '$std/encoding/front_matter.ts'
import { join } from '$std/path/mod.ts'
import { markdownToHtml } from 'parsedown'

import {
  B2_BLOG_BUCKET_ID,
  BLOG_ROOT,
  FEATURE,
  URL_BLOG_LOCAL,
} from '@/constants.ts'
import * as b2 from '@/utilities/b2.ts'
import store from '@/utilities/store.ts'
import { ImageMeta } from '@/utilities/photo_constants.ts'

export async function setCachedNote(slug, note) {
  await store.set(['notes', slug], note)
}

export async function getCachedNote(slug: string) {
  if (!slug) return null
  return (await store.get(['notes', slug])).value
}

export function deleteCachedNote(slug: string) {
  return store.delete(['notes', slug])
}

export interface Note {
  slug: string
  title: string
  published?: Date | null
  updated?: Date
  lastChecked?: number
  images?: { [slug: string]: { [imageSlug: string]: ImageMeta } }
  content: {
    commonmark: string
  }
}

const IMAGE_DATA_URL = 'https://static.bpev.me/cache/image_data.json'

// Pre-cache info
const imageInfoBySlug = fetch(IMAGE_DATA_URL).then((r) => r.json())
getNotes()

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
  let note = await getCachedNote(slug)
  if (!note || ((Date.now() - (note?.lastChecked ?? 0)) > ONE_WEEK)) {
    let filePath = ''

    if (FEATURE.B2) {
      if (BLOG_ROOT) filePath = join(BLOG_ROOT, slug + '.md')
      else throw new Error('no BLOG_ROOT')
    } else {
      if (URL_BLOG_LOCAL) filePath = join(URL_BLOG_LOCAL, slug + '.md')
      else throw new Error('no URL_BLOG_LOCAL')
    }

    try {
      const composite = FEATURE.B2
        ? await (await fetch(filePath)).text()
        : new TextDecoder('utf-8').decode(await Deno.readFile(filePath))

      if (!composite) return null
      const { attrs, body: commonmark } = extract(composite)
      const { html } = await markdownToHtml(commonmark)
      note = {
        slug,
        title: String(attrs?.title),
        published: new Date(attrs?.published as string),
        updated: new Date(attrs?.updated as string),
        content: { commonmark, html },
        lastChecked: Date.now(),
        images: (await imageInfoBySlug)?.[slug],
      }
      await setCachedNote(slug, note)
    } catch (e) {
      console.log(`Invalid Note! `, slug)
      console.error(e)
    }
  }

  return note
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
  await setCachedNote(note.slug, note)
  return result
}
