import { extract } from '$std/encoding/front_matter.ts'
import { join } from '$std/path/mod.ts'

import * as b2 from '@/utilities/b2.ts'
import { BLOG_ROOT, FEATURE } from '@/constants.ts'
const notesCache: { [slug: string]: Note } = {}

export interface Note {
  title: string
  content: string
  slug: string
  published?: Date | null
  snippet?: string | null
  updated?: Date
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
    return (await Promise.all(['vx1', 'weblinks'].map(getNote))).filter(
      Boolean,
    ) as Note[]
  }
}

export async function getNote(slug: string): Promise<Note | null> {
  if (!notesCache[slug]) {
    if (!BLOG_ROOT) throw new Error('no BLOG_ROOT')
    const noteURI = join(BLOG_ROOT, slug + '.md')
    const text = await (await fetch(noteURI)).text()
    if (!text) return null
    const { attrs, body } = extract(text)
    notesCache[slug] = {
      slug,
      title: String(attrs.title),
      published: new Date(attrs.published as any),
      updated: new Date(attrs.updated as any),
      content: body,
      snippet: String(attrs.snippet) || '',
    }
  }

  return notesCache[slug]
}

export async function postNote(note: Note): Promise<void> {
  const path = `${note.slug}.md`
  const body = '---\n' +
    `published: ${note.published}\n` +
    `title: ${note.title}\n` +
    '---\n' +
    note.content
  const result = await b2.postNote({ path, body })
  delete notesCache[note.slug]
  return result
}
