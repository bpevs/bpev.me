import Head from "next/head";
import Header from "../LayoutHeader/LayoutHeader";
import stylesheet from "../index.css";


const LayoutHeader = (props) => (
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

export default LayoutHeader;
