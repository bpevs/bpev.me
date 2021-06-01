// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/4a50660/react/v16.13.1/react.d.ts"
import React from "https://dev.jspm.io/react@16.13.1";
import ReactDOMServer from "https://dev.jspm.io/react-dom@16.13.1/server";
import { renderFileToString } from "https://deno.land/x/dejs@0.9.3/mod.ts";
import { ensureFileSync } from 'https://deno.land/std@0.97.0/fs/mod.ts';

import App from './components/App.tsx';
import getLocalPosts from './services/getLocalPosts.ts';

// Grab CLI Args
const [ rootPath, buildPath = Deno.args[1] || './build' ] = Deno.args;

if (!rootPath) {
  console.log('[ deno-md-site ] Please specify root path');
  Deno.exit(1);
}

// Write Blog Posts
const posts = await getLocalPosts(rootPath);

// Write Root
writePage(`${buildPath}/index.html`, <App path={'/'} posts={posts} />);

(Object.keys(posts))
  .forEach(permalink => {
    writePage(
      `${buildPath}${permalink}.html`,
      <App path={permalink} posts={posts} />
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
