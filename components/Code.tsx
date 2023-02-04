import shiki from "https://esm.sh/shiki?target=deno"

const highlighter = await shiki.getHighlighter({
  theme: 'nord',
  langs: ['javascript', 'python']
})

export default function({children}) {
  const __html = highlighter.codeToHtml(children, { lang: 'js' });
  return (
    <code><pre dangerouslySetInnerHTML={{__html}} /></code>
    )
}
