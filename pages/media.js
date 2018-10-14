import Router from "next/router";
import Layout from "../components/Layout/Layout";
import Media from "../components/Media/Media";
import { fetchContentById } from "../utilities/store";


export default class MediaPage extends React.Component {
  constructor(props) {
    super(props);
  }

  static async getInitialProps(context) {
    return {
      id: context.query.mediaId,
      post: await fetchContentById(context.query.postId),
    };
  }

  componentDidMount() {
    this.listener = document.addEventListener("keypress", evt => {
      const { id, post } = this.props;
      const postId = Router.router.query.postId;
      const index = post.content.indexOf(id);

      let nextIndex = -1;
      if (evt.key === "ArrowRight") {
        nextIndex = index + 1;
      } else if (evt.key === "ArrowLeft") {
        nextIndex = index - 1;
      } else if (evt.key === "ArrowUp") {
        Router.push({ pathname: "/post", query: { postId: postId } }, `/${postId}`);
      }

      if (nextIndex >= 0 && nextIndex < post.content.length) {
        const id = post.content[nextIndex];
        Router.replace({
          pathname: "/media",
          query: { postId: postId, mediaId: id },
        }, `/${postId}/${id}`);
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this.listener);
  }

  render() {
    const { id, post } = this.props;
    const index = post.content.indexOf(id);
    const preloadRange = [ 1, 2, 3, -1, -2, -3 ];

    if (Router && Router.router) {
      preloadRange.forEach(diff => {
        const nextUrl = post.content[index + diff];
        if (nextUrl) {
          new Image().src = post.root + "/large/" + nextUrl
        }
      });
    }

    return (
      <Layout header="center">
        <div autoFocus>
          <Media
            className="sm-col-10 md-col-6 center-block scale-down"
            src={post.root + "/large/" + id}
          />
          <p className="center">{index + 1}/{post.content.length}</p>
        </div>
      </Layout>
    ); 
  }
}
