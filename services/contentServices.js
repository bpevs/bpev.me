import { memoize } from "@civility/utilities"
import "isomorphic-unfetch"
import { ASSET_URL } from "../constants"


/**
 * @typedef BlogMeta
 * @type {object}
 * @property {Array<string>} authors list of authors who write posts
 * @property {Array<PostMeta>} metadata list of blog posts
 */

/**
 * @typedef PostMeta
 * @type {object}
 * @property {string} author
 * @property {(string|Array<string>)?} content article text or resource path array
 * @property {string} contentRoot
 * @property {string} contentType
 * @property {string} createdDate
 * @property {boolean} draft
 * @property {string} id
 * @property {string?} series
 * @property {Array<string>} tags
 * @property {string} title
 * @property {string?} updatedDate
 * @property {string} root
 */

export const readArticleText = memoize(fetchArticleText)
export const readBlogMeta = memoize(fetchBlogMeta)
export const readPost = memoize(fetchPost)
export const readPostMeta = memoize(fetchPostMeta)

/**
 * @returns {Promise<BlogMeta>}
 */
async function fetchBlogMeta() {
    const response = await fetch(ASSET_URL + "/index.json")
    const items = await response.json()
    return items.map(item => {
      item.id = item.permalink
      return item
    })
}

/**
 *
 * @param {string} path of post root
 * @returns {Promise<PostMeta>} metadata describing a post
 */
async function fetchPostMeta(path) {
  const response = await fetch(path + "/index.json")
  return response.json()
}

/**
 *
 * @param {string} path of post root
 * @returns {Promise<string>} Post text string
 */
async function fetchArticleText(path) {
  const README = await fetch(path + "/index.md")
  return await README.text()
}

/**
 * Fetch blog post
 * @param {string} postId id of post
 * @returns {Promise<PostMeta>} Updated with content
 */
export async function fetchPost(postId) {
  const indexList = await readBlogMeta()
  const post = indexList.find(item => item.id === postId)

  if (!post) throw new Error(`No post with id: ${postId}`)

  const path = ASSET_URL + "/posts/" + post.permalink
  const metadata = await readPostMeta(path)
  const content = await readArticleText(path)

  return { ...metadata, content, contentRoot: ASSET_URL + "/posts/" + post.permalink }

  // if (type === "gallery") return { ...metadata, root: path }
  return metadata
}
