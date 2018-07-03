import Link from "next/link";

export default function LinkPost({ post }) {
  return (
    <Link
      prefetch
      as={`/post/${post.id}`}
      href={`/post?id=${post.id}`}
    ><a className="text-decoration-none">
      <li key={post.id} className="p1 m1 mt3 link-post">
            <span className="h3 link-post-title">{post.title}</span>
          {
            !post.series
            ? ""
            : <span className="black block pt2 muted o5">{post.series}</span>
          }
      </li>
    </a></Link>
  );
};
