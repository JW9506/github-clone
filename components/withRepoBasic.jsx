import Repo from "components/Repo"
import Link from "next/link"
import { useRouter } from "next/router"
import api from "lib/universalApi"
import { get, cache } from "lib/repoBasicCache"
import { useEffect } from "react"

const isServer = typeof window === "undefined"

function makeQuery(queryObject) {
  const query = Object.entries(queryObject)
    .reduce((ret, entry) => {
      ret.push(entry.join("="))
      return ret
    }, [])
    .join("&")
  return `?${query}`
}

const WithRepoBasic = (Comp, type = "index") => {
  withDetail.getInitialProps = async (appCtx) => {
    let compProps
    if (Comp.getInitialProps) {
      compProps = await Comp.getInitialProps(appCtx)
    }
    const { ctx, reduxStore } = appCtx
    const { owner, name } = ctx.query

    let repoBasic
    const full_name = `${owner}/${name}`

    if (get(full_name)) {
      repoBasic = get(full_name)
    } else {
      const { data } = await api.request(
        {
          url: `/repos/${owner}/${name}`,
        },
        ctx.req,
        ctx.res,
        reduxStore
      )
      repoBasic = data
    }

    return { repoBasic, ...compProps }
  }

  function withDetail({ repoBasic, ...restProps }) {
    useEffect(() => {
      if (!isServer) cache(repoBasic)
    })
    const router = useRouter()
    const query = makeQuery(router.query)
    return (
      <div className="Detail">
        <div className="repo-basic">
          <Repo repo={repoBasic} />
          <div className="tabs">
            {type === "index" ? (
              <span className="tab index">Readme</span>
            ) : (
              <Link href={`/detail${query}`}>
                <a className="tab index">Readme</a>
              </Link>
            )}
            {type === "issues" ? (
              <span className="tab index">Issues</span>
            ) : (
              <Link href={`/detail/issues${query}`}>
                <a className="tab issues">Issues</a>
              </Link>
            )}
          </div>
        </div>
        <div>
          <Comp {...restProps} />
        </div>
        <style jsx>
          {`
            .Detail {
              padding-top: 2rem;
            }
            .repo-basic {
              padding: 2rem;
              border: 1px solid #eee;
              margin-bottom: 2rem;
              border-radius: 0.5rem;
            }
            .tab + .tab {
              margin-left: 2rem;
            }
          `}
        </style>
      </div>
    )
  }
  return withDetail
}

export default WithRepoBasic
