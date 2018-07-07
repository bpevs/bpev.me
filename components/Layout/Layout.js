import Header from "../LayoutHeader/LayoutHeader";
import stylesheet from "../index.css";


const LayoutHeader = (props) => (
  <div className={"sans-serif container m2 block mx-auto " + (props.className || "")}>
    <Header />
    <section className="clearfix mx-auto">
      {props.children}
    </section>

    <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
  </div>
);

export default LayoutHeader;
