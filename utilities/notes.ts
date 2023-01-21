import { extract } from "$std/encoding/front_matter.ts";
import { join } from "$std/path/mod.ts";
import { walk } from "$std/fs/mod.ts";

interface Note {
  slug: string;
  title: string;
  published: Date;
  updated: Date;
  content: string;
  snippet: string;
}

export async function getNotes(): Promise<Note[]> {
  let promises = [];

  for await (const entry of walk("./notes")) {
    if (entry.isFile && /.*\.md$/.test(entry.path)) {
      const slug = entry.path.replace("notes/", "").replace(".md", "");
      promises.push(getNote(slug));
    }
  }

  const notes = await Promise.all(promises) as Note[];
  notes.sort((a, b) => b.published.getTime() - a.published.getTime());
  return notes;
}

export async function getNote(slug: string): Promise<Note | null> {
  const text = await Deno.readTextFile(join("./notes", `${slug}.md`));
  const { attrs, body } = extract(text);
  return {
    slug,
    title: attrs.title,
    published: new Date(attrs.published),
    updated: new Date(attrs.updated),
    content: body,
    snippet: attrs.snippet,
  };
}
