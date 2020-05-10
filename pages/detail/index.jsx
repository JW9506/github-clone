import withRepoBasic from "components/withRepoBasic"
import api from "lib/universalApi"
import dynamic from "next/dynamic"

const MarkdownRenderer = dynamic(
  () =>
    import(
      /* webpackChunkName: "markdownrenderer" */ "components/markdownRenderer"
    ),
  {
    loading: () => <div>Markdown Renderer currently loading</div>,
  }
)

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
  if (!readme) return <p>Readme does not exist in this repository</p>
  return <MarkdownRenderer content={readme.content} base64 />
}

export default withRepoBasic(Detail, "index")
