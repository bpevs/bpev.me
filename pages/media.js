import { get } from "@civility/utilities"
import Error from "next/error"
import Router from "next/router"
import React from "react"
import Layout from "../components/Layout"
import Media from "../components/Media"
import { readPost } from "../services/contentServices"


export default class MediaPage extends React.Component {

  // Index range to preload images from
  preloadRange = [ 1, 2, 3, -1, -2, -3 ]
  state = {}

  /**
   * Setup page-turn listener
   * @param {object} props
   */
  constructor(props) {
    super(props)
    this._listenForPageTurn = this._listenForPageTurn.bind(this)
  }

  static async getInitialProps(context) {
    const { mediaId = null, postId = null } = get(context, [ "query" ]) || {}
    const post = await readPost(postId)
    return { mediaId, post }
  }

  componentDidCatch(error, info) {
    console.warn(error, info)
    this.setState({ error })
  }

  componentDidMount() {
    document.addEventListener("keypress", this._listenForPageTurn)
  }

  // Preload images 3 after and 2 before current image
  // For performance, particularly during quick-scrolling
  componentDidUpdate() {
    const { mediaId, post } = this.props
    const index = post.content.indexOf(mediaId)

    this.preloadRange.forEach(diff => {
      const nextImage = post.content[index + diff]
      const nextURL = post.root + "/large/" + nextImage
      if (nextImage) new Image().src = nextURL
    })
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this._listenForPageTurn)
  }

  render() {
    const { error, mediaId, post } = this.props

    if (error) return <Error statusCode={error.statusCode} />

    const itemNum = (get(post, [ "content" ]) || []).indexOf(mediaId) + 1
    if (itemNum === 0) return <Error statusCode={404} />

    const itemURL = post.root + "/large/" + mediaId
    const itemTotal = post.content.length
    const imageClass = "sm-col-10 md-col-6 center-block scale-down"

    return (
      <Layout headerAlign="center">
        <Media className={imageClass} src={itemURL} />
        <p className="center">{itemNum}/{itemTotal}</p>
      </Layout>
    )
  }

  /**
   * Listens for arrow keys and acts accordingly
   * @param {object} evt Key Event
   */
  _listenForPageTurn({ key }) {
    const { mediaId, post } = this.props
    const postId = get(Router, [ "router", "query", "postId" ])
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
