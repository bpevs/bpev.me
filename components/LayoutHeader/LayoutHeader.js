import Link from "next/link";

export default () => (
    <nav className="fit">
        <Link as={`/`} href={`/`} prefetch>
          <a className="h1 m1 black text-decoration-none header-title">
            Ben Pevsner
          </a>
        </Link>
    </nav>
);
