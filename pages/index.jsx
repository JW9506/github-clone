import Head from "next/head"
import api from "lib/universalApi"

Home.getInitialProps = async (appCtx) => {
  const { ctx, reduxStore } = appCtx
  const { user } = reduxStore.getState()
  if (user && user.userInfo == null) {
    return { isLogin: false }
  }
  const { data: userRepos } = await api.request(
    { url: "/user/repos" },
    ctx.req,
    ctx.res
  )
  const { data: starred } = await api.request(
    { url: "/user/starred" },
    ctx.req,
    ctx.res
  )
  return { isLogin: true, userRepos, starred }
}

export default function Home({ isLogin, userRepos, starred }) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>index</div>
    </>
  )
}
