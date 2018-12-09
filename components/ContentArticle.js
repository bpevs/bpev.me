import hljs from "highlight.js/lib/highlight"
import hljsJavascript from "highlight.js/lib/languages/javascript"
import marksy from "marksy"
import React, { createElement } from "react"
import Layout from "./Layout"
import Media from "./Media"
import RelatedPosts from "./RelatedPosts"


// Syntax Highlighting
hljs.registerLanguage("javascript", hljsJavascript)

// Map markdown entities to React Components
const compile = marksy({
  createElement,
  elements: {
    img: Media,
  },

  highlight(language, code) {
    return hljs.highlight(language, code).value
  },
})


export default function ContentArticle({ post, relatedPosts }) {
  return (
    <Layout className="fit-800">
      <div className="mt4 mb4 mx-auto fit-800 article">
        {compile(post.content, null, { type: "blog", post }).tree}
      </div>
      <RelatedPosts post={post} relatedPosts={relatedPosts} />
    </Layout>
  )
}
