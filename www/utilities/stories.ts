import { extract } from "$std/encoding/front_matter.ts";
import { join } from "$std/path/mod.ts";
import { walk } from "$std/fs/mod.ts";

interface Story {
  slug: string;
  title: string;
  published: Date;
  updated: Date;
  content: string;
  snippet: string;
}

export async function getStories(): Promise<Story[]> {
  // Fetch from Backblaze
  const stories = await Promise.all(promises) as Story[];

  stories.sort((a, b) => b.published.getTime() - a.published.getTime());
  return stories;
}

export async function getStories(slug: string): Promise<Story | null> {
  const text = await Deno.readTextFile(join("./stories", `${slug}.md`));
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
