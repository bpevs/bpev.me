/**
 * Case-insensitive includes
 * @param {string} parent
 * @param {string} subString
 * @returns {boolean}
 */
export function includes(parent= "", subString= "") {
  return parent.toLowerCase().includes(subString.toLowerCase())
}

/**
 * Determines whether a string matches any part of a post
 * @param {string} search
 * @param {object} post
 * @returns {boolean}
 */
export function shouldShowPost(search= "", post= {}) {
  if (!post || post.draft) return false

  return !search
    || includes(post.title, search)
    || includes(post.series, search)
    || includes(post.author, search)
    || (post.tags || []).some(tag => includes(tag, search))
}
