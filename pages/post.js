import marksy from "marksy";
import { intersection, sampleSize } from "lodash";
import Link from "next/link";
import { createElement } from "react";
import Layout from "../components/Layout/Layout";
import LinkPost from "../components/LinkPost/LinkPost";
import Media from "../components/Media/Media";
import { fetchContentById, fetchMeta } from "../utilities/store";
import hljs from "highlight.js/lib/highlight";
import hljsJavascript from "highlight.js/lib/languages/javascript";


hljs.registerLanguage("javascript", hljsJavascript);

const compile = marksy({
  createElement,
  elements: {
    img: Media,
  },
  highlight(language, code) {
    return hljs.highlight(language, code).value
  },
});

export class Post extends React.Component {
  static async getInitialProps(context) {
    return {
      meta: await fetchMeta(),
      post: await fetchContentById(context.query.postId)
    };
  }

  render() {
    if (!this.props.post) {
      return (
        <Layout className="fit-800">
          <h1 className="center pt4 mt4">{"There's nothing here!"}</h1>
          <p className="center">
            Try looking on the <Link href="/"><a>homepage</a></Link>
          </p>
        </Layout>
      )
    }

    const { content, contentType, id, root } = this.props.post;
    const similarPostComponents = this.props.meta.metadata
      .filter(post => {
        return post.id !== this.props.post.id && !post.draft &&
          intersection(this.props.post.tags, post.tags).length;
      })
      .map(post => <LinkPost key={post.id} post={post} />)
      .slice(0, 3);

    const similarPosts = (
      <ul className="list-reset">
        <h1>Similar Posts...</h1>
        {similarPostComponents}
      </ul>
    );

    if (contentType === "article") {
      return (
        <Layout className="fit-800">
          <div className="mt4 mb4 mx-auto fit-800 article">
            {compile(content, null, { type: "blog", id }).tree}
          </div>
          { similarPostComponents.length ? similarPosts : "" }
        </Layout>
      );
    }

    if (contentType === "gallery") {
      return (
        <Layout>
          <div className="center p2">
            <div className="flex flex-wrap mxn2">
              {content.map((name, key) => {
                return (
                  <Link
                    as={`/${id}/${name}`}
                    key={key}
                    href={`/media?postId=${id}&mediaId=${name}`}>
                    <a className="flex fit-50 overflow-hidden height-500">
                      <span className="image-wrapper">
                        <img
                          width="600"
                          height="600"
                          className="cover image pointer"
                          src={root + "/medium/" + name}
                        />
                        <span className="spinkit-wrapper">
                          <div className="spinkit" />
                        </span>
                      </span>
                    </a>
                  </Link>
                );
              })}
            </div>
            { similarPostComponents.length ? similarPosts : "" }
          </div>
        </Layout>
      );
    }

    return <Layout>Content Not Found</Layout>;
  }
}

export default Post;

function sortByDate(a = "", b = "") {
  const [ aYear, aMonth, aDay ] = a.createdDate.split("-");
  const [ bYear, bMonth, bDay ] = b.createdDate.split("-");
  return new Date(bYear, bMonth, bDay) - new Date(aYear, aMonth, aDay);
}
