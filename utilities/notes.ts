import { extract } from "$std/encoding/front_matter.ts";
import { join } from "$std/path/mod.ts";

interface Note {
  slug: string;
  title: string;
  published: Date;
  updated: Date;
  content: string;
  snippet: string;
}

export async function getNotes(): Promise<Note[]> {
  const files = Deno.readDir("./notes");
  const promises = [];
  for await (const file of files) {
    const slug = file.name.replace(".md", "");
    promises.push(getNote(slug));
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
