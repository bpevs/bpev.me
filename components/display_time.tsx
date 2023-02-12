export default function DisplayTime(
  { t, style }: { t: number; style?: { [key: string]: string } },
) {
  const minutes = Math.round(t / 60)
  const seconds = String(Math.round(t % 60)).padStart(2, '0')
  return <span style={style}>{minutes}:{seconds}</span>
}
