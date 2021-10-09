import type { Post, Posts } from "../utilities/parsePost.ts";
import { parsePost } from "../utilities/parsePost.ts";

const B2_KEY_ID = Deno.env.get("B2_KEY_ID");
const B2_APPLICATION_KEY = Deno.env.get("B2_APPLICATION_KEY");
const B2_API_VERSION = Deno.env.get("B2_API_VERSION");

/**
 *  Implement using b2 api
 *  https://www.backblaze.com/b2/docs/b2_list_file_names.html
 *  https://github.com/benaubin/b2-js
 *
 * Step 1: use B2 api to list from bpev-static/posts
 * Step 2: use static api to fetch content of every post
 * Step 3: parse the same way as `getPostsFromFs`
 */
export async function getPostsFromB2() {
  const authData = await authorize();
  const list = await listFileNames(authData);
  const posts = await fetchPosts(list);
  return posts;
}

interface B2Credentials {
  applicationKeyId: string;
  applicationKey: string;
}

async function authorize() {
  const Authorization = `Basic ${btoa(B2_KEY_ID + ":" + B2_APPLICATION_KEY)}`;

  return (await fetch(
    `https://api.backblazeb2.com/b2api/${B2_API_VERSION}/b2_authorize_account`,
    { headers: { Authorization } },
  )).json();
}

async function listFileNames({
  apiUrl,
  allowed,
  authorizationToken,
}: any) {
  const url = `${apiUrl}/b2api/${B2_API_VERSION}/b2_list_file_names`;
  const options = {
    method: "POST",
    headers: { Authorization: authorizationToken },
    body: JSON.stringify({ bucketId: allowed.bucketId, prefix: "posts" }),
  };

  return (await (await fetch(url, options)).json())
    .files.map((listItem: any) => listItem.fileName);
}

async function fetchPosts(names: string[]): Promise<Posts> {
  const postsArray = await Promise.all(names.map(async (path) => {
    const resp = await fetch(`https://static.bpev.me/${path}`);
    return parsePost(path, await resp.text());
  }));

  const posts: Posts = {};
  postsArray.forEach((post: Post) => {
    posts[post.permalink] = post;
  });
  return posts;
}
