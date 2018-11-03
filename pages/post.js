import { get } from "lodash"
import Error from "next/error"
import React from "react"
import ContentArticle from "../components/ContentArticle/ContentArticle"
import ContentPhotoAlbum from "../components/ContentPhotoAlbum/ContentPhotoAlbum"
import { fetchContentById, fetchMeta, getError } from "../utilities/store"


export class Post extends React.Component {
  state = {}

  static async getInitialProps(context) {
    console.log(context.query)
    return {
      error: await getError(),
      meta: await fetchMeta(),
      post: await fetchContentById(context.query.postId),
    }
  }

  componentDidCatch(error, info) {
    console.warn(error, info)
    this.setState({ Error })
  }

  render() {
    const { error, post } = this.props
    const relatedPosts = get(this, "props.meta.metadata", [])
    const postProps = { post, relatedPosts }

    if (error) return <Error statusCode={error.statusCode} />
    console.log(post)
    switch (post && post.contentType) {
      case "article": return (<ContentArticle {...postProps} />)
      case "gallery": return (<ContentPhotoAlbum {...postProps} />)
      default: return <Error statusCode={404} />
    }
  }
}

export default Post
