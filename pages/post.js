import marksy from "marksy";
import { createElement } from "react";
import Layout from "../components/Layout/Layout";
import Image from "../components/MediaImage/Image";
import { fetchContentById } from "../utilities/store";

const compile = marksy({
  createElement,
  elements: {
    img: Image,
  }
});

export class Post extends React.Component {
  static async getInitialProps(context) {
    return await fetchContentById(context.query.id);
  }

  render() {
    const { content, contentType, id, root } = this.props;

    if (contentType === "article") {
      return (
        <Layout className="fit-800">
          <div className="mt4 mb4 mx-auto fit-800">
            {compile(content, null, { type: "blog", id }).tree}
          </div>
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
                  <a
                    className="flex fit-50 overflow-hidden max-height-500"
                    href={root + "/large/" + name}
                    key={key}
                    target="_blank"
                  >
                    <img
                      className="cover image pointer"
                      src={root + "/medium/" + name}
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
