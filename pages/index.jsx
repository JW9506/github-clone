import config from "next/config"
import Head from "next/head"
import { Button, Tabs } from "antd"
import api from "lib/universalApi"
import { connect } from "react-redux"
import { useRouter } from "next/router"

const { publicRuntimeConfig } = config()
const { OAUTH_URL } = publicRuntimeConfig
import Repo from "components/Repo"
import { useEffect } from "react"

let cachedUserRepos, cachedStarred
const isServer = typeof window === "undefined"

Home.getInitialProps = async (appCtx) => {
  const { ctx, reduxStore } = appCtx
  const { user } = reduxStore.getState()

  if (user && user.userInfo == null) {
    return {}
  }

  let userRepos, starred

  if (!cachedUserRepos) {
    const { data } = await api.request({ url: "/user/repos" }, ctx.req, ctx.res)
    userRepos = data
  } else {
    userRepos = cachedUserRepos
  }

  if (!cachedStarred) {
    const { data } = await api.request(
      { url: "/user/starred" },
      ctx.req,
      ctx.res
    )
    starred = data
  } else {
    starred = cachedStarred
  }

  if (!isServer) {
    cachedUserRepos = userRepos
    cachedStarred = starred
  }

  return { userRepos, starred }
}

function Home({ userInfo, userRepos, starred }) {
  useEffect(() => {
    if (!isServer) {
      cachedUserRepos = userRepos
      cachedStarred = starred
    }
  }, [])

  const router = useRouter()
  const tabKey = router.query.key || "1"

  const handleTabChange = (activeKey) => {
    router.push(`/?key=${activeKey}`)
  }

  const content = userInfo ? (
    <div className="Home">
      <div className="user-info">
        <img src={userInfo.avatar_url} alt="user avatar" className="avatar" />
        <span className="login">{userInfo.login}</span>
        <span className="name">{userInfo.name}</span>
        <span className="bio">{userInfo.bio}</span>
      </div>
      <div className="user-repos">
        <Tabs
          defaultActiveKey={tabKey}
          animated={false}
          onChange={handleTabChange}
        >
          <Tabs.TabPane tab="Repo" key="1">
            {userRepos.map((repo) => (
              <Repo key={Math.random().toString().slice(2)} repo={repo} />
            ))}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Watching" key="2">
            {starred.map((repo) => (
              <Repo key={Math.random().toString().slice(2)} repo={repo} />
            ))}
          </Tabs.TabPane>
        </Tabs>
      </div>
      <style jsx>
        {`
          .Home {
            display: flex;
            align-items: flex-start;
            padding: 2rem 0;
          }
          .user-info {
            width: 200px;
            margin-right: 4rem;
            display: flex;
            flex-direction: column;
          }
          .login {
            font-weight: 800;
            font-size: 2rem;
            margin-top: 2rem;
          }
          .name {
            font-size: 1.6rem;
            color: #777;
          }
          .bio {
            margin-top: 2rem;
            color: #333;
          }
          .avatar {
            width: 100%;
            border-radius: 0.5rem;
          }
          .user-repos {
            flex-grow: 1;
          }
        `}
      </style>
    </div>
  ) : (
    <div className="Home">
      <span>You are not logged in</span>
      <Button type="primary" href={OAUTH_URL}>
        Login
      </Button>
      <style jsx>
        {`
          .Home {
            height: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}
      </style>
    </div>
  )
  return (
    <>
      <Head>
        <title>Github Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {content}
    </>
  )
}

const mapStateToProps = (state) => ({
  userInfo: state.user.userInfo,
})

export default connect(mapStateToProps)(Home)
