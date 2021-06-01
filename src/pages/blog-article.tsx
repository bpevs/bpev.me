/*
 * A blog article
 * Article implies this is primarily text.
 * Driven by Markdown.
 */

// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/4a50660/react/v16.13.1/react.d.ts"
import React from "https://dev.jspm.io/react@16.13.1";
import hljs from "https://dev.jspm.io/highlight.js@11.0.0"

import marksy from "https://dev.jspm.io/marksy@8.0.0"

import { Post } from '../services/getLocalPosts.ts';

// Map markdown entities to React Components
// console.log(marksy.default)
const compile = (marksy as any).default({
  createElement: React.createElement,
  // elements: {
  //   a: Media,
  //   img: Media,
  //   ul: List,
  // },

  highlight(language: any, code: any) {
    return (hljs as any).highlight(code, { language }).value
  }
});

export default function BlogArticle({ post }: {
  post: Post
}) {
  const content = (post && post.text)
    ? compile(post.text, null, { root: post.permalink }).tree
    : null

  return <div>{content}</div>
}
