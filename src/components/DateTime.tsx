import { React } from "../deps.ts";

export type TimeProps = React.HTMLProps<any> & {
  locale?: string;
  options?: any; //Intl.DateTimeFormatOptions,
  timestamp: number | string | Date;
};

const DEFAULT_OPTIONS = {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
};

const DateTime: React.FC<TimeProps> = ({
  locale,
  options = {},
  timestamp = Date.now(),
  ...props
}) => {
  const date = new Date(timestamp);
  const text = date.toLocaleString(locale, { ...DEFAULT_OPTIONS, ...options });
  const dateTime = date.toISOString();

  return <time {...props} children={text} dateTime={dateTime} />;
};

export default DateTime;
