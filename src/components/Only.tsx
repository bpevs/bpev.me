import { React } from "../deps.ts";

export type OnlyProps = React.HTMLProps<HTMLDivElement> & {
  if: any;
};

const Only: React.FC<OnlyProps> = (props) => {
  const child = props.if ? props.children : "";
  return <React.Fragment>{child}</React.Fragment>;
};

export default Only;
