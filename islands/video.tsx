export default function (
  embed: string,
) {
  return (
    <iframe
      src={embed}
      width='100%'
      height='500'
      allowFullScreen
      sandbox='true'
      style={{ border: 'none' }}
    >
    </iframe>
  )
}
