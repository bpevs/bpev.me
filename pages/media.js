import { get } from "lodash"
import Router from "next/router"
import React from "react"
import Layout from "../components/Layout/Layout"
import Media from "../components/Media/Media"
import { fetchContentById } from "../utilities/store"


export default class MediaPage extends React.Component {

  // Index range to preload images from
  preloadRange = [ 1, 2, 3, -1, -2, -3 ]

  /**
   * Setup page-turn listener
   * @param {object} props
   */
  constructor(props) {
    super(props)
    this._listenForPageTurn = this._listenForPageTurn.bind(this)
  }

  /**
   *
   * @param {object} context
   */
  static async getInitialProps(context) {
    const { mediaId, postId } = get(context, "query", {})
    const post = await fetchContentById(postId)
    return { mediaId, post }
  }

  componentDidMount() {
    document.addEventListener("keypress", this._listenForPageTurn)
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this._listenForPageTurn)
  }

  render() {
    const { mediaId, post } = this.props
    const index = post.content.indexOf(mediaId)

    // Preload images 3 after and 2 before current image
    // For performance, particularly during quick-scrolling
    if (Router && Router.router) {
      this.preloadRange.forEach(diff => {
        const nextUrl = post.content[index + diff]
        if (nextUrl) {
          new Image().src = post.root + "/large/" + nextUrl
        }
      })
    }

    return (
      <Layout header="center">
        <div>
          <Media
            className="sm-col-10 md-col-6 center-block scale-down"
            src={post.root + "/large/" + mediaId}
          />
          <p className="center">{index + 1}/{post.content.length}</p>
        </div>
      </Layout>
    )
  }

  /**
   * Listens for arrow keys and acts accordingly
   * @param {object} evt Key Event
   */
  _listenForPageTurn({ key }) {
    const { mediaId, post } = this.props
    const postId = get(Router, "router.query.postId")
    if (!postId) return

    // Exit to previous article
    if (key === "ArrowUp") {
      return Router.push({
        pathname: "/post",
        query: { postId } },
        `/${postId}`,
      )
    }

    // Turn page forward or backward
    let nextIndex = post.content.indexOf(mediaId)

    if (key === "ArrowRight") ++nextIndex
    else if (key === "ArrowLeft") --nextIndex
    else return

    if (nextIndex < post.content.length && nextIndex >= 0) {
      const mediaId = post.content[nextIndex]
      Router.replace({
        pathname: "/media",
        query: { postId, mediaId },
      }, `/${postId}/${mediaId}`)
    }
  }
}
