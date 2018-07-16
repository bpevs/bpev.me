import Layout from "../components/Layout/Layout";
import Link from "../components/LinkPost/LinkPost";
import { fetchMeta } from "../utilities/store";


export default class Index extends React.Component {

  state = {};

  constructor(props) {
    super(props);
  }

  static async getInitialProps() {
    return { content: await fetchMeta() };
  }

  onChange(evt) {
    this.setState({ search: evt.target.value });
  }

  render() {
    const { content } = this.props;
    const search = this.state.search;
    return (
      <Layout className="fit-800">
        <div className="ml1 mt3 p1 center search-input jsonly">
          <label className="p1 h4">filter</label>
          <input
            autoFocus
            className="h4 p1"
            onChange={this.onChange.bind(this)}
            placeholder="e.g. code, coffee, music"
            role="search"
            title="filter blog posts"
            type="search"
            value={this.state.value}
          />
        </div>
        <ul className="list-reset">
          {
            content && content.metadata
            .filter(post => post && !post.draft && matchesSearch(search, post))
            .sort(sortByDate)
            .map((post, index) => <Link
              key={index}
              post={post}
            />)
          }
        </ul>
      </Layout>
    ); 
  }
}

function matchesSearch(searchString, post) {
  if (!searchString) return true;
  const search = searchString.toLowerCase();
  const { author, series, title, tags } = post;

  if (title && ~title.toLowerCase().indexOf(search)) return true;
  if (series && ~series.toLowerCase().indexOf(search)) return true;
  if (author && ~author.toLowerCase().indexOf(search)) return true;
  return tags && tags.some(tag => ~tag.toLowerCase().indexOf(search));
}

function sortByDate(a, b) {
  return new Date(b.updatedDate) - new Date(a.updatedDate);
}
