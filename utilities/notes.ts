import { extract } from '$std/encoding/front_matter.ts'
import { join } from '$std/path/mod.ts'
import { markdownToHtml, markdownToPlaintext } from 'parsedown'

import * as b2 from '@/utilities/b2.ts'
import { BLOG_ROOT, FEATURE, URL_BLOG_LOCAL } from '@/constants.ts'
const notesCache: { [slug: string]: Note } = {}

export interface Note {
  slug: string
  title: string
  published?: Date | null
  updated?: Date
  lastChecked?: number
  content: {
    commonmark: string
    html?: string
    text?: string
  }
}

export async function getNotes(): Promise<Note[]> {
  const notes$ = []
  if (FEATURE.B2) {
    for (const file of await b2.getNotes()) {
      notes$.push(getNote(file.fileName.replace(/\.md$/, '')))
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
  const note = notesCache[slug]
  if (!note || ((Date.now() - (note?.lastChecked ?? 0)) > ONE_WEEK)) {
    let filePath = ''

    if (FEATURE.B2) {
      if (BLOG_ROOT) filePath = join(BLOG_ROOT, slug + '.md')
      else throw new Error('no BLOG_ROOT')
    } else {
      if (URL_BLOG_LOCAL) filePath = join(URL_BLOG_LOCAL, slug + '.md')
      else throw new Error('no URL_BLOG_LOCAL')
    }

    const composite = FEATURE.B2
      ? await (await fetch(filePath)).text()
      : new TextDecoder('utf-8').decode(await Deno.readFile(filePath))

    if (!composite) return null
    const { attrs, body: commonmark } = extract(composite)
    const [text, { html }] = await Promise.all([
      markdownToPlaintext(commonmark),
      markdownToHtml(commonmark),
    ])

    notesCache[slug] = {
      slug,
      title: String(attrs?.title),
      published: new Date(attrs?.published as string),
      updated: new Date(attrs?.updated as string),
      content: { commonmark, html, text },
      lastChecked: Date.now(),
    }
  }

  return notesCache[slug]
}

export async function postNote(note: Note): Promise<void> {
  const path = `${note.slug}.md`
  const body = '---\n' +
    `published: ${note.published}\n` +
    `title: "${note.title}"\n` +
    '---\n' +
    note.content.commonmark
  const result = await b2.postNote({ path, body })
  delete notesCache[note.slug]
  return result
}
