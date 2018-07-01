import Link from "next/link";

export default function LinkPost({ post }) {
  return (
    <Link
      as={`/post/${post.id}`}
      href={`/post?id=${post.id}`}
    >
      <li key={post.id} className="p1 m1 mt3 link-post">
          <a className="h3 link-post-title">{post.title}</a>
        {
          !post.series
          ? ""
          : <span className="block pt2 muted o5">{post.series}</span>
        }
      </li>
    </Link>
  );
};
