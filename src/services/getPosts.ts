import { parse } from "https://deno.land/std@0.97.0/encoding/yaml.ts";
import { walk } from "https://deno.land/std@0.97.0/fs/mod.ts";
import { relative } from "https://deno.land/std@0.97.0/path/mod.ts";

export interface Post {
  permalink: string;
  text: string;
  [prop: string]: any;
}

export type Posts = { [permalink: string]: Post };

export default async function getPosts(
  rootPath: string,
): Promise<Posts> {
  const walkOptions = {
    exts: [".md"],
    skip: [/README/],
  };

  const posts: Posts = {};

  for await (const entry of walk(rootPath, walkOptions)) {
    const { path, isFile, isDirectory } = entry;
    if (!isFile) break;

    const relativePath = rootPath ? relative(rootPath, path) : path;
    const name = path.substring(
      path.lastIndexOf("/") + 1,
      path.lastIndexOf("."),
    );

    const fileText: string = await Deno.readTextFile(path);
    const splitText: string[] =
      /(?:^---\n)([\s\S]*)(?:---\n)(([\s\S])*)/gm.exec(fileText) || [];
    const hasFrontmatter: boolean = Boolean(splitText.length);
    const markdownText = hasFrontmatter ? splitText[2] : fileText;
    const frontmatter: any = hasFrontmatter ? parse(splitText[1]) : {};

    const permalink = `/posts/${frontmatter?.permalink || name}`;

    posts[permalink] = {
      ...(typeof frontmatter === "object" ? frontmatter : {}),
      permalink,
      text: markdownText,
    };
  }

  return posts;
}
