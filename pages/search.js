import { get } from "lodash"
import Error from "next/error"
import Router from "next/router"
import React from "react"
import Layout from "../components/Layout/Layout"
import Link from "../components/LinkPost/LinkPost"
import Tag from "../components/Tag/Tag"
import { shouldShowPost } from "../utilities/predicates"
import { sortByDateString } from "../utilities/sorts"
import { fetchMeta } from "../utilities/store"

export default class Index extends React.Component {

  mainCategories = [ "code", "music", "photos", "coffee" ]

  state = {
    search: "",
  }

  constructor(props) {
    super(props)
  }

  static async getInitialProps({ query }) {
    const content = await fetchMeta()
    const search = query.filter
    return { content, search }
  }

  componentDidCatch(error, info) {
    console.warn(error, info)
    this.setState({ hasError: true })
  }

  onChange({ target }) {
    const search = target.value
    const href = `/?filter=${search}`

    this.setState({ search })
    Router.replace(href, href, { shallow: true })
  }

  render() {
    const { content, error } = this.props
    if (error) return <Error statusCode={error.statusCode} />

    const search = this.state.search == null ? this.props.search : this.state.search
    const tags = this.mainCategories.map(name => {
      const onClick = this.onChange.bind(this, { target: { value: name }})
      return <Tag key={name} children={<a children={name} onClick={onClick} />} />
    })

    return (
      <Layout className="fit-800">
        <div className="ml1 mt3 p1 center search-input jsonly">
          <label className="p1 h4">filter</label>
          <input
            autoComplete="true"
            className="col-5 h4 p1"
            onChange={this.onChange.bind(this)}
            placeholder="e.g. code, coffee, music"
            role="search"
            title="filter blog posts"
            type="search"
            value={search || ""}
          />
          <div>{tags}</div>
        </div>
        <ul className="list-reset">
          {
            get(content, "metadata", [])
              .filter(post => shouldShowPost(search, post))
              .sort((a, b) => sortByDateString(a.createdDate, b.createdDate))
              .map((post, index) => <Link key={index} post={post} />)
          }
        </ul>
      </Layout>
    )
  }
}
