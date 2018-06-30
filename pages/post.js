import { find, get } from "lodash";
import marksy from "marksy";
import { createElement } from "react";
import Layout from "../components/Layout/Layout";
import { fetchContent } from "../utilities/store";

const compile = marksy({ createElement });

function Post(props) {
  const contentType = get(props, [ "content", "contentType" ]);
  if (props.contentType === "article") {
    return (
      <Layout>
        <div className="sm-col sm-col-8 md-col-9 px3 mt2 mb2 fit-800">
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
              return <img src={url} key={key} className="flex fit-50 cover" />;
            })}
          </div>
        </div>
      </Layout>
    );
  }

  return <Layout>Content Not Found</Layout>;
};

Post.getInitialProps = async (context) => {
  const content = await fetchContent();
  const requestedId = context.query.id;
  return find(content, post => post.id === requestedId) || {};
}

export default Post;
