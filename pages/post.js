import { find, get } from "lodash";
import marksy from "marksy";
import Link from "next/link";
import { createElement } from "react";
import Layout from "../components/Layout/Layout";
import { fetchContent } from "../utilities/store";

const compile = marksy({ createElement });

export class Post extends React.Component {
  static async getInitialProps(context) {
    const content = await fetchContent();
    const requestedId = context.query.id;
    return find(content, post => post.id === requestedId) || {};
  }

  componentDidMount() {
    require("intersection-observer");
    require("lozad")(".lozad", {
      threshold: 0.1,
      load(el) {
            el.src = el.dataset.src;
            el.onload = () => el.classList.add("fade");
        }
    }).observe();
  }

  render() {
    const props = this.props;
    const contentType = get(props, [ "content", "contentType" ]);
    if (props.contentType === "article") {
      return (
        <Layout>
          <div className="mt4 mb4 mx-auto fit-800">
            {compile(props.content).tree}
          </div>
        </Layout>
      );
    }

    if (props.contentType === "photo-album") {
      return (
        <Layout>
          <div className="center p2">
            <div className="flex flex-wrap mxn2">
              {props.content.map((url, key) => {
                return (
                  <a
                    className="flex fit-50 overflow-hidden max-height-500"
                    href={url}
                    key={key}
                    target="_blank"
                  >
                    <img
                      className="cover lozad pointer"
                      data-src={url}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </Layout>
      );
    }

    return <Layout>Content Not Found</Layout>;
  }
}

export default Post;
