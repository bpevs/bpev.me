import { find } from "lodash";
import marksy from "marksy";
import { createElement } from "react";
import Layout from "../components/Layout/Layout";
import { fetchContent } from "../utilities/store";

const compile = marksy({ createElement });

function Post({ text }) {
  return <Layout>{compile(text).tree}</Layout>;
};

Post.getInitialProps = async (context) => {
  const content = await fetchContent();
  const requestedId = context.query.id;
  const post = find(content, post => post.id === requestedId);

  return { text: post.content } || { text: "article not found" }
}

export default Post;
