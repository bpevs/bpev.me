import Link from "next/link";
import Tag from "../Tag/Tag";

export default function LinkPost({ post }) {
  return (
    <Link
      prefetch
      as={`/post/${post.id}`}
      href={`/post?id=${post.id}`}
    ><a className="text-decoration-none">
      <li key={post.id} className="p1 m1 mt3 link-post">
          <span className="h3 link-post-title">{post.title}</span>
          <div>
            <span className="h5 black pt2">{post.createdDate} | {" "}</span>
            <span>{post.tags.map(tag => <Tag>{tag}</Tag>)}</span>
          </div>
      </li>
    </a></Link>
  );
};
