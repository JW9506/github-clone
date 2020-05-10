import withRepoBasic from "components/withRepoBasic"
import MarkdownIt from "markdown-it"
import "github-markdown-css"
import api from "lib/universalApi"

const md = new MarkdownIt({ html: true, linkify: true })

function b64_to_utf8(str) {
  return decodeURIComponent(escape(atob(str)))
}

Detail.getInitialProps = async (appCtx) => {
  const { ctx, reduxStore } = appCtx
  const { owner, name } = ctx.query
  const { data } = await api.request(
    {
      url: `/repos/${owner}/${name}/readme`,
    },
    ctx.req,
    ctx.res,
    reduxStore
  )
  const readme = data
  return { readme }
}
function Detail({ readme }) {
  const content = b64_to_utf8(readme.content)
  const html = md.render(content)
  return (
    <div className="markdown-body">
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  )
}

export default withRepoBasic(Detail, "index")
