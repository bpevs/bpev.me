import { React } from '../deps.ts'
import classNames from "../utilities/classNames.ts";

const pageStyles = "content sans-serif container m2 block mx-auto";
const linkStyle = "white p2 o5 text-decoration-none";

export default ({
  children,
  className = "",
  headerAlign = "",
}: any) => {
  return (
    <div>
      <div className={classNames(pageStyles, className)}>
        <Header align={headerAlign} />
        <section className="clearfix mx-auto">
          {children}
        </section>
      </div>
      <Footer />
    </div>
  );
};

function Header({ align = "" }) {
  return (
    <nav className={`fit ${align}`}>
      <a
        href="/"
        className="h1 m1 black text-decoration-none header-title"
        children="Ben Pevsner"
      />
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer sans-serif col-12 pt4 pb4 mt4">
      <div className="row white p2">
        Made by Ben Pevsner
      </div>
      <div className="row p2">
        <a
          children="github"
          href="https://github.com/ivebencrazy"
          className={linkStyle}
        />
        <a
          children="bandcamp"
          href="https://ivebencrazy.bandcamp.com/"
          className={linkStyle}
        />
        <a
          children="youtube"
          href="https://www.youtube.com/channel/UCpznF0d3ky603SFPzJwtT0g"
          className={linkStyle}
        />
      </div>
    </footer>
  );
}
