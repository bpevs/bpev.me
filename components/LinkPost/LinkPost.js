import Link from "next/link";
import Tag from "../Tag/Tag";

export default function LinkPost({ post }) {
  return (
    <Link
      as={`/post/${post.id}`}
      href={`/post?id=${post.id}`}
      prefetch
    ><a className="text-decoration-none" onClick={() => window.scrollTo(0, 0)}>
      <li key={post.id} className="p1 m1 mt3 link-post">
          <span className="h3 link-post-title">{post.title}</span>
          <div>
            <span className="h5 black pt2">{post.createdDate} | {" "}</span>
            <span>{post.tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)}</span>
          </div>
      </li>
    </a></Link>
  );
};
