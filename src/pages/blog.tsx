/**
 * The root page of the blog.
 */
import type { Posts } from "../services/getPosts.ts";

import { React } from '../deps.ts';
import AboutMe from "../components/AboutMe.tsx";
import DateTime from '../components/DateTime.tsx';
import Only from '../components/Only.tsx';
import { isNumber } from '../utilities/typeGuards.ts';

export default function Blog({
  posts,
}: {
  posts: Posts;
}) {
  const postsArray = Object.keys(posts).map(path => posts[path]);

  const filteredPosts = postsArray
    .filter((post: any) => post && shouldShowPost('', post))
    .sort((a: any, b: any) => new Date(b.created).getTime() - new Date(a.created).getTime())
    .reduce((all: any, post: any, currIndex: any, arr: any) => {
      const thisYear = new Date(post.created).getFullYear()
      if (!all.length) return [thisYear, post]

      const lastPost = arr[currIndex - 1]
      if (isNumber(lastPost)) return all.concat(post)

      const lastYear = new Date(lastPost.created).getFullYear()
      return all.concat(lastYear !== thisYear ? [thisYear, post] : [post])
    }, [])
    .map((post: any, index: any) => isNumber(post)
      ? <h2 key={index}>{post}</h2>
      : <Post key={index} post={post} />,
    )

  return (
    <React.Fragment>
      <AboutMe />
      <ul className="list-reset">{filteredPosts}</ul>
    </React.Fragment>
  );
}

// Case-insensitive includes
export function includes(parent: string = "", subString: string = ""): boolean {
  return parent.toLowerCase().includes(subString.toLowerCase())
}


// Determines whether a string matches any part of a post
export function shouldShowPost(search: string = "", post: any = {}): boolean {
  if (
    !post ||
    post.draft === true ||
    post.private === true ||
    post.unlisted === true ||
    post.published === false
  ) return false
  if (!post.created) return false

  return !search
    || includes(post.title, search)
    || includes(post.series, search)
    || includes(post.author, search)
    || (post.tags || []).some((tag: string) => includes(tag, search))
}

export function Post({ post }: any) {
  const permalink = `/posts${post.permalink}`;
  return (
    <li key={permalink} className="post-li">
      <a className="p0 m0 link-post text-decoration-none" href={permalink}>
        <span className="h3 link-post-title align-middle">{post.title} </span>
        <Only if={post.created}>
          <DateTime
            className="h4 align-middle o5 p1 link-post-title"
            timestamp={new Date(post.created).getTime()}
            options={{
              day: "numeric",
              month: "numeric",
              weekday: undefined,
              year: undefined,
            }}
          />
        </Only>
      </a>
    </li>
  )
}
