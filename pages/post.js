import { get } from "lodash"
import Error from "next/error"
import React from "react"
import ContentArticle from "../components/ContentArticle/ContentArticle"
import ContentPhotoAlbum from "../components/ContentPhotoAlbum/ContentPhotoAlbum"
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
    const relatedPosts = get(this, "props.meta.metadata", [])
    const postProps = { post, relatedPosts }

    if (this.state.error) return <Error statusCode={this.state.error.statusCode} />

    switch (post && post.contentType) {
      case "article": return (<ContentArticle {...postProps} />)
      case "gallery": return (<ContentPhotoAlbum {...postProps} />)
      default: return <Error statusCode={404} />
    }
  }
}

export default Post
