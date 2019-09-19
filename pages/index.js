import "isomorphic-unfetch"

import { Blog, fetchPost, fetchPosts } from "@blog-o-matic/react"
import { Only } from "@civility/react"
import Error from "next/error"
import React from "react"
import AboutMe from "../components/AboutMe"
import Layout from "../components/Layout"

const POSTS_ROOT = "https://static.bpev.me/"
const POST_ROOT = "https://static.bpev.me/posts/"

class Index extends React.Component {
  static async getInitialProps(props) {
    const { filter, postId, subDomain } = props.query

    return {
      list: await fetchPosts(POSTS_ROOT),
      post: postId ? await fetchPost(POST_ROOT, postId) : null,
      search: filter || subDomain,
    }
  }

  componentDidCatch(error, info) {
    console.warn(error, info)
    this.setState({ error })
  }

  render() {
    const { error, list, post } = this.props
    if (error) return <Error statusCode={error.statusCode} />

    return (
      <Layout className="fit-800 pl3 pr3 justify-center">
        <Only if={!post}><AboutMe /></Only>

        <Blog
          list={list}
          post={post}
          root={POSTS_ROOT}
          shouldFetch={false}
        />
      </Layout>
    )
  }
}

export default Index
