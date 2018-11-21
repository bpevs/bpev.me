import React from "react"

const DEFAULT_OPTIONS = {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
}

export default function DateTime({
  locale,
  options = {},
  timestamp,
  ...props
}) {
  const date = new Date(timestamp)
  const text = date.toLocaleString(locale, { ...DEFAULT_OPTIONS, ...options })

  return <time
    {...props}
    children={text}
    dateTime={timestamp}
  />
}
