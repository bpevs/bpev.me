/*
 * A blog article
 * Article implies this is primarily text.
 * Driven by Markdown.
 */
import type { Post } from "../utilities/parsePost.ts";

import { hljs, marksy, React } from "../deps.ts";
import List from "../components/List.tsx";
import Media from "../components/Media.tsx";
import Only from "../components/Only.tsx";
import classNames from "../utilities/classNames.ts";

// Map markdown entities to React Components
// console.log(marksy.default)
const compile = (marksy as any).default({
  createElement: React.createElement,
  elements: {
    a: Media,
    img: Media,
    ul: List,
  },

  highlight(language: any, code: any) {
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
    <div className={classNames("mt4 mb4 mx-auto fit-800 article")}>
      <Only if={content}>{content}</Only>
      {
        /*        <Only if={list.length && !content}><Posts posts={list} /></Only>
        <Only if={!content && !list.length}>Loading...</Only>*/
      }
    </div>
  );
}
