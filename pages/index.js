import { get, isNumber } from "@civility/utilities"
import Error from "next/error"
import React from "react"
import Layout from "../components/Layout"
import Link from "../components/LinkPost"
import { readBlogMeta } from "../services/contentServices"
import { shouldShowPost } from "../utilities/predicates"
import { sortByDateString } from "../utilities/sorts"


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
    const { content, error } = this.props
    if (error) return <Error statusCode={error.statusCode} />

    const search = this.state.search == null ? this.props.search : this.state.search

    const searchResults = get(content, [ "metadata" ], [])
      .filter(post => post && shouldShowPost(search, post))
      .sort((a, b) => sortByDateString(a.createdDate, b.createdDate))
      .reduce((all, post, currIndex, arr) => {
        const thisYear = parseInt(post.createdDate.slice(0, 4), 10)
        if (!all.length) return [ thisYear, post ]
        const lastPost = arr[currIndex - 1]
        if (isNumber(lastPost)) return all.concat(post)
        const lastYear = parseInt(lastPost.createdDate.slice(0, 4), 10)
        return all.concat(lastYear !== thisYear ? [ thisYear, post ] : [ post ])
      }, [])
      .map((post, index) => isNumber(post)
        ? <h2 key={index}>{post}</h2>
        : <Link key={index} post={post} />,
      )


    return (
      <Layout className="fit-800">
        { this.props.user ? "LOGGED IN" : ""}
        <h1 className="center">HI HI HI 👋</h1>
        <p>
          I'm Ben. I make things. Mostly code and music.  If you're familiar with my work,
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
        <ul className="list-reset">{searchResults}</ul>
      </Layout>
    )
  }
}

export default Index
