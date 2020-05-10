import config from "next/config"
import Head from "next/head"
import { Button, Tabs } from "antd"
import api from "lib/universalApi"
import { connect } from "react-redux"
import { useRouter } from "next/router"
import LRUCache from "lru-cache"
import { useEffect } from "react"

import { cacheArray } from "lib/repoBasicCache"
const { publicRuntimeConfig } = config()
const { OAUTH_URL } = publicRuntimeConfig
import Repo from "components/Repo"

const isServer = typeof window === "undefined"

let cachedUserRepos, cachedStarred

const cache = new LRUCache({
  maxAge: 1800 * 1000,
})

Home.getInitialProps = async (appCtx) => {
  const { ctx, reduxStore } = appCtx
  const { user } = reduxStore.getState()

  if (user && user.userInfo == null) {
    return {}
  }

  let userRepos, starred

  if (!isServer) {
    cachedUserRepos = cache.get("userRepos")
    cachedStarred = cache.get("starred")
  }

  if (!cachedUserRepos) {
    const { data } = await api.request(
      { url: "/user/repos" },
      ctx.req,
      ctx.res,
      reduxStore
    )
    userRepos = data
  } else {
    userRepos = cachedUserRepos
  }

  if (!cachedStarred) {
    const { data } = await api.request(
      { url: "/user/starred" },
      ctx.req,
      ctx.res,
      reduxStore
    )
    starred = data
  } else {
    starred = cachedStarred
  }

  return { userRepos, starred }
}

function Home({ userInfo, userRepos, starred }) {
  useEffect(() => {
    if (!isServer) {
      cache.set("userRepos", userRepos)
      cache.set("starred", starred)
      if (userRepos) cacheArray(userRepos)
      if (starred) cacheArray(starred)
    }
  })

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
            {userRepos &&
              userRepos.map((repo) => (
                <Repo key={Math.random().toString().slice(2)} repo={repo} />
              ))}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Watching" key="2">
            {starred &&
              starred.map((repo) => (
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
