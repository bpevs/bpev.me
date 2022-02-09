import { walk } from "fs";
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
    const { path, isFile } = entry;
    if (!isFile) break;

    const fileText: string = await Deno.readTextFile(path);
    const post = parsePost(path, fileText);
    posts[post.permalink] = post;
  }

  return posts;
}
