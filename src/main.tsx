import React from "react";
import ReactDOMServer from "react-dom";
import { copySync } from "copy-unstable";
import { ensureFileSync } from "fs";
import { renderFileToString } from "dejs";

import App from "./components/App.tsx";
import { getPostsFromFs } from "./services/getPostsFromFs.ts";
import { getPostsFromB2 } from "./services/getPostsFromB2.ts";
import { shouldShowPost } from "./pages/blog.tsx";

// Env Variables
const B2_KEY_ID = Deno.env.get("B2_KEY_ID");
const B2_APPLICATION_KEY = Deno.env.get("B2_APPLICATION_KEY");
const B2_API_VERSION = Deno.env.get("B2_API_VERSION");
const FS_PATH = Deno.env.get("FS_PATH");

// Grab CLI Args
const [
  type = "b2",
  buildPath = Deno.args[1] || "./build",
] = Deno.args;

console.log(`[ bpev ] Attempting to build from ${type}...`);

if (
  (type == "fs" && !FS_PATH) ||
  (type == "b2" && (!B2_APPLICATION_KEY || !B2_KEY_ID || !B2_API_VERSION))
) {
  console.log("[ bpev ] Missing Environment Variables:");
  if (!B2_APPLICATION_KEY) console.log("- B2_APPLICATION_KEY");
  if (!B2_KEY_ID) console.log("- B2_KEY_ID");
  if (!B2_API_VERSION) console.log("- B2_API_VERSION");
  if (!FS_PATH) console.log("- FS_PATH");
  Deno.exit(1);
}

// Write Blog Posts
console.log("[ bpev ] Fetching posts...");
const posts = (type === "fs" && FS_PATH)
  ? await getPostsFromFs(FS_PATH)
  : await getPostsFromB2();

// Write Static Pages
if (posts) {
  console.log("[ bpev ] Writing static pages...");
  writePage(`${buildPath}/index.html`, <App path={"/"} posts={posts} />);
  writePage(`${buildPath}/vx1.html`, <App path={"/vx1"} posts={posts} />);
}

const postIds: string[] = (posts ? Object.keys(posts) : []);

console.log(`[ bpev ] Writing ${postIds.length} posts`);

postIds.forEach((permalink) => {
  if (buildPath && posts) {
    writePage(
      `${buildPath}${permalink}.html`,
      <App path={permalink} posts={posts} />,
    );
    writePage(
      `${buildPath}/posts/${permalink}.html`,
      <App path={permalink} posts={posts} />,
    );
  }
});

function writePage(filePath: string, app: any): void {
  // Create file if one doesn't exist
  ensureFileSync(filePath);

  // Render App into string
  const content = (ReactDOMServer as any).renderToString(app);

  // Write to file
  Deno.writeTextFileSync(
    filePath,
    `<!DOCTYPE html />\n${content}`,
  );
}

console.log("[ bpev ] Copying Static Files...");
copySync("./src/static", `${buildPath}/static`, { overwrite: true });

console.log("[ bpev ] Complete!");
