/*
 * A blog article
 * Article implies this is primarily text.
 * Driven by Markdown.
 */
import type { Post } from "../utilities/parsePost.ts";

import React from "react";
import hljs from "highlight";
import marksy from "marksy";
import javascript from "hljs-javascript";
import yaml from "hljs-yaml";

import List from "../components/List.tsx";
import Media from "../components/Media.tsx";
import Only from "../components/Only.tsx";
import Vx1Header from "../components/Vx1Header.tsx";
import classNames from "../utilities/classNames.ts";

(hljs as any).registerLanguage("js", javascript);
(hljs as any).registerLanguage("javascript", javascript);
(hljs as any).registerLanguage("yaml", yaml);

// Map markdown entities to React Components
const compile = (marksy as any).default({
  createElement: React.createElement,
  elements: {
    a: Media,
    img: Media,
    ul: List,
  },

  highlight(language = "txt", code: string) {
    return (hljs as any).highlight(code, { language }).value;
  },
});

export default function BlogArticle({ post }: {
  post: Post;
}) {
  const content = (post && post.text)
    ? compile(post.text, null, { root: post.permalink }).tree
    : null;

  return (
    <React.Fragment>
      <Only if={post.permalink.includes("vx1")}>
        <Vx1Header title={post.title} />
      </Only>
      <div className={classNames("mt4 mb4 mx-auto fit-800 article")}>
        <Only if={content}>{content}</Only>
        {
          /*        <Only if={list.length && !content}><Posts posts={list} /></Only>
          <Only if={!content && !list.length}>Loading...</Only>*/
        }
      </div>
    </React.Fragment>
  );
}
