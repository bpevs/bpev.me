import Layout from "../components/Layout/Layout";
import Link from "../components/LinkPost/LinkPost";
import { fetchContent } from "../utilities/store";


export default function Index(props) {
  return (
    <Layout>
      <h2 className="h2">Posts</h2>
      <ul className="">
        {
          props.content.map((post, index) => <Link
              key={index}
              post={post}
            />)
        }
      </ul>
    </Layout>
  ); 
};


Index.getInitialProps = async () => {
  return {
    content: await fetchContent()
  };
}
