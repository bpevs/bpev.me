import "isomorphic-unfetch"

import { Blog, fetchPost, fetchPosts } from "@blog-o-matic/react"
import { Only } from "@civility/react"
import Error from "next/error"
import React from "react"
import Layout from "../components/Layout"

const ROOT = "https://static.bpev.me/"

class Index extends React.Component {
  static async getInitialProps(props) {
    const { filter, postId, subDomain } = props.query

    return {
      list: await fetchPosts(ROOT),
      post: postId ? await fetchPost(ROOT, postId) : null,
      search: filter || subDomain,
    }
  }

  componentDidCatch(error, info) {
    console.warn(error, info)
    this.setState({ error })
  }

  render() {
    const { error, list, post, user } = this.props
    if (error) return <Error statusCode={error.statusCode} />

    return (
      <Layout className="fit-800 pl3 pr3 justify-center">
        { user ? "LOGGED IN" : ""}
        <Only if={!post}>
          <h1 className="center h1 p3">Hi! I'm Ben! 👋</h1>
          <p>
            I make things. Mostly code and music. If you're familiar with my work,
            {" "}you probably use <a href="https://favioli.com">Favioli</a>, saw me on
            {" "}<a href="https://www.youtube.com/channel/UCpznF0d3ky603SFPzJwtT0g">Youtube</a>, or know me personally.
            {" "}So I apologize for whichever of those you have experienced.
          </p>
          <p>
            This blog is basically a place to put random thoughts and stuff. If you haven't gotten
            {" "}enough of me, then feel free to poke around. I try to write stuff in a way that
            {" "}is readable and teaches new things. So hopefully you will learn something new.
          </p>
          <br />
        </Only>
        <Blog
          list={list}
          post={post}
          root={ROOT}
          shouldFetch={false}
        />
      </Layout>
    )
  }
}

export default Index
