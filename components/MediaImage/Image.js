import { getStore } from "../../utilities/store";
import { ASSET_URL } from "../../constants";

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
    if (article && article.contentRoot) {
      src = article.contentRoot + props.src
        .replace("./", "/")
        .replace("images/", "medium/")
      src = ASSET_URL + src
    }
  }

  return <img
    {...props}
    className={ "col-12 " + (props.className || "") }
    src={src}
  />;
}
