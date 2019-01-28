import { Blog } from "@blog-o-matic/react"
import { get } from "@civility/utilities"
import React from "react"
import Layout from "../components/Layout"
import { readBlogMeta } from "../services/contentServices"


export class Post extends React.Component {
  state = {}

  static async getInitialProps() {
    return {
      meta: await readBlogMeta(),
    }
  }

  componentDidCatch(error, info) {
    console.warn(error, info)
    this.setState({ error })
  }

  render() {
    return (
      <Layout className="fit-800">
        <Blog
          className=""
          style={{}}
          root="https://static.bpev.me/"
          id={get(this, [ "props", "router", "query" , "postId" ])}
        />
      </Layout>
    )
  }
}

export default Post
