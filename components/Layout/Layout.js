import Header from "../LayoutHeader/LayoutHeader";
import stylesheet from "../index.css";


const LayoutHeader = (props) => (
  <div className="sans-serif container m2">
    <Header />
    <section
     className="clearfix sm-col sm-col-8 md-col-9 px3 mt2 mb2 fit-800"
    >
      {props.children}
    </section>

    <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
  </div>
);

export default LayoutHeader;
