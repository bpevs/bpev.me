export default function (
  embed: string,
) {
  return (
    <iframe
      src={embed}
      width='100%'
      height='500'
      allowfullscreen
      sandbox
      style={{ border: 'none' }}
    >
    </iframe>
  )
}
