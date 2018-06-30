import Link from "next/link";

export default function LinkPost({ post }) {
  return (
    <li key={post.id} className="m3 p1 border-left rounded">
      <Link
        as={`/post/${post.id}`}
        href={`/post?id=${post.id}`}
        >
        <a className="h3">
          {post.title}
        </a>
      </Link>
      {
        !post.series
          ? ""
          : <span className="block pt2 muted o5">{post.series}</span>
      }
    </li>
  );
};
