import { get } from "@civility/utilities"
import Error from "next/error"
import React from "react"
import ContentArticle from "../components/ContentArticle"
import { readBlogMeta, readPost } from "../services/contentServices"


export class Post extends React.Component {
  state = {}

  static async getInitialProps(context) {
    return {
      meta: await readBlogMeta(),
      post: await readPost(context.query.postId),
    }
  }

  componentDidCatch(error, info) {
    console.warn(error, info)
    this.setState({ error })
  }

  render() {
    const { post } = this.props
    const relatedPosts = get(this, [ "props", "meta" ]) || []
    const postProps = { post, relatedPosts }
    if (this.state.error) return <Error statusCode={this.state.error.statusCode} />
    return (<ContentArticle {...postProps} />)
  }
}

export default Post
