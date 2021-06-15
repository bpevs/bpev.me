import { React, ReactDOMServer } from './deps.ts'
import { renderFileToString } from "https://deno.land/x/dejs@0.9.3/mod.ts";
import { ensureFileSync, copy } from "https://deno.land/std@0.97.0/fs/mod.ts";

import App from "./components/App.tsx";
import getPosts from "./services/getPosts.ts";
import { shouldShowPost } from "./pages/blog.tsx"

// Grab CLI Args
const [rootPath, buildPath = Deno.args[1] || "./build"] = Deno.args;

if (!rootPath) {
  console.log("[ deno-md-site ] Please specify root path");
  Deno.exit(1);
}

// Write Blog Posts
const posts = await getPosts(rootPath);

// Write Root
writePage(`${buildPath}/index.html`, <App path={"/"} posts={posts} />);

(Object.keys(posts))
  .filter(postId => {
    const post = posts[postId];
    return shouldShowPost('', post);
  })
  .forEach((permalink) => {
    writePage(
      `${buildPath}${permalink}.html`,
      <App path={permalink} posts={posts} />,
    );
    writePage(
      `${buildPath}/posts/${permalink}.html`,
      <App path={permalink} posts={posts} />,
    );
  });

function writePage(filePath: string, app: any): void {
  // Create file if one doesn't exist
  ensureFileSync(filePath);

  // Render App into string
  const content = (ReactDOMServer as any).renderToString(app);

  // Write to file
  Deno.writeTextFileSync(filePath, content);
}

copy('./src/static', `${buildPath}/static`, { overwrite: true });
