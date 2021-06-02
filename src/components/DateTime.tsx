// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/4a50660/react/v16.13.1/react.d.ts"
import React from "https://dev.jspm.io/react@16.13.1";


export type TimeProps = React.HTMLProps<any> & {
  locale?: string,
  options?: any, //Intl.DateTimeFormatOptions,
  timestamp: number | string | Date,
}

const DEFAULT_OPTIONS = {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
}

const DateTime: React.FC<TimeProps> = ({
  locale,
  options = {},
  timestamp = Date.now(),
  ...props
}) => {
  const date = new Date(timestamp)
  const text = date.toLocaleString(locale, { ...DEFAULT_OPTIONS, ...options })
  const dateTime = date.toISOString()

  return <time {...props} children={text} dateTime={dateTime} />
}

export default DateTime
