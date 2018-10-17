/**
 * Expect year in format of YYYY-MM-DD
 * @param {string} a
 * @param {string} b
 * @returns Number
 */
export function sortByDateString(a = "", b = "") {
  const [ aYear, aMonth, aDay ] = a.split("-").map(Number)
  const [ bYear, bMonth, bDay ] = b.split("-").map(Number)
  return Number(new Date(bYear, bMonth, bDay)) - Number(new Date(aYear, aMonth, aDay))
}
