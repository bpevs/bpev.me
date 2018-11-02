import React from "react"

const months = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function LongDate({ date }) {
  if (!date) return <span></span>

  const [ y, m, d ] = date.split("-")

  return <span
    children={`${months[Number(m) - 1]} ${d}, ${y}`}
    className="h5 black pt2"
  />
}
