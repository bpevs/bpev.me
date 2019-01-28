import { Blog } from "@blog-o-matic/react"
import Error from "next/error"
import React from "react"
import Layout from "../components/Layout"
import { readBlogMeta } from "../services/contentServices"

class Index extends React.Component {

  mainCategories = [ "code", "music", "photos", "coffee" ]

  state = {
    search: null,
  }

  constructor(props) {
    super(props)
  }

  static async getInitialProps(props) {
    const content = await readBlogMeta()
    const search = props.query.filter || props.query.subDomain
    return { content, search }
  }

  componentDidCatch(error, info) {
    console.warn(error, info)
    this.setState({ error })
  }

  onChange(evt) {
    const search = evt.target.value || ""
    this.setState({ search })
  }

  render() {
    const { error } = this.props
    if (error) return <Error statusCode={error.statusCode} />

    return (
      <Layout className="fit-800 pl3 pr3 justify-center">
        { this.props.user ? "LOGGED IN" : ""}
        <h1 className="center h1 p3">Hi! I'm Ben! 👋</h1>
        <p>
          I make things. Mostly code and music.  If you're familiar with my work,
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
        <Blog root="https://static.bpev.me/" />
      </Layout>
    )
  }
}

export default Index
