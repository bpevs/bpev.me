/**
 * The root page of the blog.
 */
import type { Posts } from '../services/getLocalPosts.ts';
import React from "https://dev.jspm.io/react@16.13.1";

export default function Blog({
  posts
}: {
  posts: Posts
}) {
  const postPaths = Object.keys(posts);

  return (
    <div className="app">
      {
        Object.keys(posts).map(postPath => {
          const post = posts[postPath] || {};
          return (
            <a href={postPath} key={postPath}>
               {post.title}
            </a>
          )
        })
      }
    </div>
  );
}
