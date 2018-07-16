import { getStore } from "../../utilities/store";

export default function Image(props) {
  if (
    !props ||
    !props.context ||
    !props.context.id ||
    (props.context.type !== "blog")
  ) {
    return <img {...props} />;
  }

  let src = props.src;
  const store = getStore();
  if (store) {
    const article = getStore().metadata.find(({ id }) => id === props.context.id);
    src = article.contentRoot.split("/");
    src.pop();
    src.push(props.src);
    src = src.join("/");
    src = "/static/blog" + src.replace("./", "")
  }

  return <img
    {...props}
    className="col-12"
    src={src}
  />;
}
