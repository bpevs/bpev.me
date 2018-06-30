import Link from "next/link";

export default function LinkPost({ post }) {
  return (
    <li key={post.id} className="">
      <Link
        as={`/post/${post.id}`}
        href={`/post?id=${post.id}`}
        ><a>{post.title}</a></Link>
    </li>
  );
};
