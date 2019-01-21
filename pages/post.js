import { Blog } from "@blog-o-matic/react"
import { get } from "@civility/utilities"
import React from "react"
import Layout from "../components/Layout"
import RelatedPosts from "../components/RelatedPosts"
import { readBlogMeta } from "../services/contentServices"


export class Post extends React.Component {
  state = {}

  static async getInitialProps(context) {
    return {
      meta: await readBlogMeta(),
    }
  }

  componentDidCatch(error, info) {
    console.warn(error, info)
    this.setState({ error })
  }

  render() {
    const { post } = this.props
    const relatedPosts = get(this, [ "props", "meta" ]) || []
    return (
      <Layout className="fit-800">
        <Blog
          className=""
          style={{}}
          root="https://static.bpev.me/"
          id={get(this, [ "props", "router", "query" , "postId" ])}
        />
        <RelatedPosts post={post} relatedPosts={relatedPosts} />
      </Layout>
    )
  }
}

export default Post
