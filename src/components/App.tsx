import type { Posts } from '../services/getLocalPosts.ts';

import React from "https://dev.jspm.io/react@16.13.1"

import Blog from "../pages/blog.tsx"
import BlogArticle from "../pages/blog-article.tsx";

const App = ({
  path = '/',
  posts = {},
}: {
  path?: string,
  posts?: Posts
}) => {
  if (path.includes('posts')) {
    const post = posts[path] || {};
    return <BlogArticle post={post} />
  }

  return <Blog posts={posts} />
}
export default App;
