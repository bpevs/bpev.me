import Head from "next/head";
import Header from "../LayoutHeader/LayoutHeader";
import Footer from "../LayoutFooter/LayoutFooter";
import stylesheet from "../index.css";
import NProgress from "nprogress";
import Router from "next/router";

export default (props) => {
  if (Router.router) {
    Router.router.events.on("routeChangeStart", route => {
      if (Router.router.asPath.split("?")[0] !== route.split("?")[0]) {
        NProgress.start();
      }
    });
    Router.router.events.on("routeChangeComplete", () => NProgress.done());
    Router.router.events.on("routeChangeError", () => NProgress.done());
  }

  return (
    <div>
      <Head>
        <title>Ben Pevsner</title>
        <meta name="author" content="Ben Pevsner" />
        <meta name="title" content="Ben Pevsner" />
        <meta name="description" content="Eating candy and doin stuff" />
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0" />
        <link rel="shortcut icon" href="/static/favicon.ico" />

        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: ".jsonly { display: none }" }} />
        </noscript>
      </Head>

      <div className={"content sans-serif container m2 block mx-auto " + (props.className || "")}>
        { props.header === false ? "" : <Header align={props.header} /> }
        <section className="clearfix mx-auto">
          {props.children}
        </section>
      </div>

      <Footer />
    </div>
  );
};
