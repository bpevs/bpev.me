import { get } from "lodash"
import Error from "next/error"
import React from "react"
import Layout from "../components/Layout/Layout"
import Link from "../components/LinkPost/LinkPost"
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

    const searchResults = (
      <ul className="list-reset">
        {
          get(content, "metadata", [])
            .filter(post => shouldShowPost(search, post))
            .sort((a, b) => sortByDateString(a.createdDate, b.createdDate))
            .map((post, index) => <Link key={index} post={post} />)
        }
      </ul>
    )

    return (
      <Layout className="fit-800">
        { this.props.user ? "LOGGED IN" : ""}
        {searchResults}
      </Layout>
    )
  }
}

export default Index
