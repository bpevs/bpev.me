import type { Posts } from "../services/getPosts.ts";

// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/4a50660/react/v16.13.1/react.d.ts"
import React from "https://dev.jspm.io/react@16.13.1";

import Blog from "../pages/blog.tsx";
import BlogArticle from "../pages/blogArticle.tsx";

import Layout from "./Layout.tsx";

const App = ({
  path = "/",
  posts = {},
}: {
  path?: string;
  posts?: Posts;
}) => {
  let route = <Blog posts={posts} />;

  if (path.includes("posts")) {
    route = <BlogArticle post={posts[path] || {}} />;
  }

  return (
    <html>
      <head>
        <meta name="author" content="Ben Pevsner" />
        <meta name="title" content="Ben Pevsner" />
        <meta name="description" content="Eating candy and doin stuff" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0"
        />
        <link rel="shortcut icon" href="/static/favicon.ico" />
        <link href="https://unpkg.com/basscss@8.0.2/css/basscss.min.css" rel="stylesheet" />
        <link rel="stylesheet" type="text/css" href="/static/highlight-styles.css" />
        <link rel="stylesheet" type="text/css" href="/static/index.css" />
        <title>Ben Pevsner</title>
        <noscript>
          <style>{".jsonly { display: none }"}</style>
        </noscript>
      </head>
      <body>
        <Layout className="fit-800 pl3 pr3 justify-center">
          {route}
        </Layout>
      </body>
    </html>
  );
};

// const STYLESHEET_PATH = "styles.css";

// const getStylesheetHref = (path: string) => {
//   return path === '/' ? STYLESHEET_PATH : `../${STYLESHEET_PATH}`;
// };

// const getHtmlByPage = ({ path, name, html }: Page) =>
//   `
//   <!DOCTYPE html>
//   <html>
//   <head>
//     <title>${name} | ${title}</title>
//     <link rel="stylesheet" href="${getStylesheetHref(path)}">
//     <link rel="icon" href="/favicon.svg">
//   </head>
//     <body>
//       <div id="title">
//         ${title}
//       </div>
//       ${getNavigation(path)}
//       <div id="main">
//         ${html}
//       </div>
//       ${footer}
//     </body>
//   </html>
// `;


export default App;
