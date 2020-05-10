import withRepoBasic from "components/withRepoBasic"
import api from "lib/universalApi"
import MarkdownRenderer from "components/markdownRenderer"

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
  return <MarkdownRenderer content={readme.content} base64 />
}

export default withRepoBasic(Detail, "index")
