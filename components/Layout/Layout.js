import Head from "next/head";
import Header from "../LayoutHeader/LayoutHeader";
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
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: ".jsonly { display: none }" }} />
        </noscript>
      </Head>

      <div className={"header sans-serif container m2 block mx-auto " + (props.className || "")}>
        <Header />
        <section className="clearfix mx-auto">
          {props.children}
        </section>
      </div>
    </div>
  );
};
