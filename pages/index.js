import Router from "next/router"
import React from "react"
import Layout from "../components/Layout/Layout"
import Link from "../components/LinkPost/LinkPost"
import Tag from "../components/Tag/Tag"
import { fetchMeta } from "../utilities/store"


export default class Index extends React.Component {

  state = {}

  constructor(props) {
    super(props)
  }

  static async getInitialProps({ query }) {
    return {
      content: await fetchMeta(),
      search: query.filter,
    }
  }

  onChange(evt) {
    this.setState({ search: evt.target.value })
    const href = `/?filter=${evt.target.value}`
    const as = href
    Router.replace(href, as, { shallow: true })
  }

  render() {
    const { content } = this.props
    const search = this.state.search == null ? this.props.search : this.state.search
    const tags = [ "code", "music", "photos", "coffee" ].map(name => {
      const onClick = this.onChange.bind(this, { target: { value: name }})
      return <Tag key={name} children={<a children={name} onClick={onClick} />} />
    })

    return (
      <Layout className="fit-800">
        <div className="ml1 mt3 p1 center search-input jsonly">
          <label className="p1 h4">filter</label>
          <input
            autoComplete="true"
            autoFocus="true"
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
            content && content.metadata
            .filter(post => post && !post.draft && matchesSearch(search, post))
            .sort(sortByDate)
            .map((post, index) => <Link
              key={index}
              post={post}
            />)
          }
        </ul>
      </Layout>
    )
  }
}

function matchesSearch(searchString, post) {
  if (!searchString) return true
  const search = searchString.toLowerCase()
  const { author, series, title, tags } = post

  if (title && title.toLowerCase().indexOf(search) !== -1) return true
  if (series && series.toLowerCase().indexOf(search) !== -1) return true
  if (author && author.toLowerCase().indexOf(search) !== -1) return true
  return tags && tags.some(tag => tag.toLowerCase().indexOf(search) !== -1)
}

function sortByDate(a = "", b = "") {
  const [ aYear, aMonth, aDay ] = a.createdDate.split("-")
  const [ bYear, bMonth, bDay ] = b.createdDate.split("-")
  return new Date(bYear, bMonth, bDay) - new Date(aYear, aMonth, aDay)
}
