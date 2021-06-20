import { parse } from "https://deno.land/std@0.97.0/encoding/yaml.ts";

export interface Post {
  permalink: string;
  text: string;
  [prop: string]: any;
}

export interface Posts {
  [permalink: string]: Post;
}/**
 *  Parse a Blog Post frontmatter + pass markdown text.
 *  Eventually, let's formalize frontmatter to rss or atom spec, to simplify.
 *    rss: https://www.rssboard.org/rss-specification
 *    atom: https://datatracker.ietf.org/doc/html/rfc5023
 */

export function parsePost(path: string, fileText: string): Post {
  const name = path.substring(
    path.lastIndexOf("/") + 1,
    path.lastIndexOf("."),
  );
  const splitText: string[] =
    /(?:^---\n)([\s\S]*)(?:---\n)(([\s\S])*)/gm.exec(fileText) || [];
  const hasFrontmatter: boolean = Boolean(splitText.length);
  const markdownText = hasFrontmatter ? splitText[2] : fileText;
  const frontmatter: any = hasFrontmatter ? parse(splitText[1]) : {};

  const permalink = `/${frontmatter?.permalink || name}`;

  return {
    ...(typeof frontmatter === "object" ? frontmatter : {}),
    permalink,
    text: markdownText,
  };
}
