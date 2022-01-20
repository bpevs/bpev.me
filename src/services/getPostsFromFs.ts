import { walk } from "fs";
import { relative } from "path";
import { parsePost, Posts } from "../utilities/parsePost.ts";

export async function getPostsFromFs(
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

    const fileText: string = await Deno.readTextFile(path);
    const post = parsePost(path, fileText);
    posts[post.permalink] = post;
  }

  return posts;
}
