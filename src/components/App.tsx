import type { Posts } from "../utilities/parsePost.ts";

import React from "react";

import Blog from "../pages/blog.tsx";
import BlogArticle from "../pages/blogArticle.tsx";
import Vx1 from "../pages/vx1.jsx";
import Layout from "./Layout.tsx";

const App = ({
  path = "/",
  posts,
}: {
  path: string;
  posts: Posts;
}) => {
  let route = <Blog posts={posts} />;

  const isPost = path !== "/" || path.includes("posts");
  if (posts[path] && isPost) {
    route = <BlogArticle post={posts[path]} />;
  }

  return (
    <html lang="en">
      <head>
        <meta name="author" content="Ben Pevsner" />
        <meta name="title" content="Ben Pevsner" />
        <meta name="description" content="Eating candy and doin stuff" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0"
        />
        <link rel="shortcut icon" href="/static/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="/static/basscss.css" />
        <link rel="stylesheet" type="text/css" href="/static/index.css" />

        {
          /*
          Highlight.js styles. Odd props are for deferring load:
          https://www.filamentgroup.com/lab/load-css-simpler/
        */
        }
        <link
          href="/static/highlight-styles.css"
          rel="stylesheet"
          media="print"
        />
        <title>Ben Pevsner</title>
        <noscript>
          <style>{".jsonly { display: none }"}</style>
        </noscript>
      </head>
      <body>
        {path.includes("vx1")
          ? <Vx1 />
          : (
            <Layout className="fit-800 pl3 pr3 justify-center">
              {route}
            </Layout>
          )}
      </body>
    </html>
  );
};

export default App;
