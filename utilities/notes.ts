import { extract } from '$std/encoding/front_matter.ts'
import { join } from '$std/path/mod.ts'
import { markdownToHtml, markdownToPlaintext } from 'parsedown'

import * as b2 from '@/utilities/b2.ts'
import { BLOG_ROOT, FEATURE } from '@/constants.ts'
const notesCache: { [slug: string]: Note } = {}

const localNotes = ['vx1', 'weblinks', 'vx1-session-getaway'].map(getNote)

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
  if (FEATURE.B2) {
    const notePromises = (await b2.getNotes())
      .map(({ fileName }: { fileName: string }) =>
        getNote(fileName.replace(/\.md$/, ''))
      )
    const notes = (await Promise.all(notePromises)).filter(Boolean) as Note[]
    notes.sort((a, b) => {
      if (a?.published == null) return -1
      else if (b?.published == null) return 1
      else return b.published.getTime() - a.published.getTime()
    })
    return notes
  } else {
    return (await Promise.all(localNotes)).filter(
      Boolean,
    ) as Note[]
  }
}

const ONE_WEEK = 8.64e+7 * 7
export async function getNote(slug: string): Promise<Note | null> {
  const note = notesCache[slug]
  if (!note || ((Date.now() - (note?.lastChecked ?? 0)) > ONE_WEEK)) {
    if (!BLOG_ROOT) throw new Error('no BLOG_ROOT')
    const composite = await (await fetch(join(BLOG_ROOT, slug + '.md'))).text()
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
