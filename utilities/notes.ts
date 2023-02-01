import { extract } from "$std/encoding/front_matter.ts";
import { join } from "$std/path/mod.ts";

import * as b2 from "@/utilities/b2.ts";
import { BLOG_ROOT, FEATURE } from "@/constants.ts";
const notes = {};

interface Note {
  slug: string;
  title: string;
  published: Date;
  updated: Date;
  content: string;
  snippet: string;
}

export async function getNotes(): Promise<Note[]> {
  if (FEATURE.B2) {
    const notePromises = (await b2.getNotes())
      .map(({ fileName }) => getNote(fileName));
    const notes = await Promise.all(notePromises) as Note[];
    notes.sort((a, b) => b.published.getTime() - a.published.getTime());
    return notes;
  } else {
    return await Promise.all(["vx1.md", "weblinks.md"].map(getNote));
  }
}

export async function getNote(slug: string): Promise<Note | null> {
  if (!notes[slug]) {
    const noteURI = join(BLOG_ROOT, slug);
    const text = await (await fetch(noteURI)).text();
    if (!text) return null;
    const { attrs, body } = extract(text);
    notes[slug] = {
      slug,
      title: attrs.title,
      published: new Date(attrs.published),
      updated: new Date(attrs.updated),
      content: body,
      snippet: attrs.snippet,
    };
  }

  return notes[slug];
}

export async function postNote(note: Note): Promise<void> {
  const path = `${note.slug}.md`;
  const body = "---\n" +
    `published: ${note.published}\n` +
    `title: ${note.title}\n` +
    "---\n" +
    note.content;

  return uploadNote({ path, body });
}
