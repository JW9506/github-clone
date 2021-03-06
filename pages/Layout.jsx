import config from "next/config"
const { publicRuntimeConfig } = config()
const { OAUTH_URL } = publicRuntimeConfig

import { useRouter } from "next/router"
import Link from "next/link"
import { connect } from "react-redux"
import { bindActionCreators } from "@reduxjs/toolkit"
import { useState, useCallback } from "react"
import Axios from "axios"
import { Button, Layout, Input, Avatar, Tooltip, Dropdown, Menu } from "antd"
import { GithubOutlined, UserOutlined } from "@ant-design/icons"
const { Header, Footer, Content } = Layout

import Container from "components/container"
import { logout } from "reduxStore/user"

const githubIconStyle = {
  fontSize: "4rem",
  color: "white",
  marginRight: "1rem",
}

const footerStyle = {
  textAlign: "center",
}

const MyLayout = ({ children, user, logout }) => {
  const router = useRouter()
  const [search, setSearch] = useState(
    (router.query && router.query.query) || ""
  )

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value)
  }, [])

  const handleOnSearch = useCallback(() => {
    router.push(`/search?query=${search}`)
  }, [search])

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  const handleGotoOAuth = useCallback(
    async (e) => {
      e.preventDefault()
      const response = await Axios.get(`/prepare-auth?url=${router.asPath}`)
      if (response.status === 200) {
        location.href = OAUTH_URL
      }
    },
    [router]
  )

  const userDropDown = (
    <Menu>
      <Menu.Item>
        <button onClick={handleLogout}>Logout</button>
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout>
      <Header>
        <Container comp={<div className="cm-header" />}>
          <div className="header-left">
            <Link href="/">
              <GithubOutlined style={githubIconStyle} />
            </Link>
            <Input.Search
              placeholder="Search Repo"
              value={search}
              onChange={handleSearchChange}
              onSearch={handleOnSearch}
            />
          </div>

          <div className="header-right">
            <div className="user">
              {user && user.userInfo && user.userInfo.id ? (
                <Dropdown overlay={userDropDown}>
                  <a href="/">
                    <Avatar size={40} src={user.userInfo.avatar_url} />
                  </a>
                </Dropdown>
              ) : (
                <Tooltip title="Click to Login" placement="bottom">
                  <a href={OAUTH_URL} onClick={handleGotoOAuth}>
                    <Avatar size={40} icon={<UserOutlined />} />
                  </a>
                </Tooltip>
              )}
            </div>
          </div>
        </Container>
      </Header>
      <Content>
        <Container>{children}</Container>
      </Content>
      <Footer style={footerStyle}>{new Date().getFullYear()}</Footer>
      <style jsx>{`
        .cm-header {
          display: flex;
          justify-content: space-between;
        }
        .header-left {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      `}</style>
      <style jsx global>
        {`
          html {
            font-size: 62.5%;
          }
          #__next {
            height: 100%;
          }
          .ant-layout {
            min-height: 100%;
          }
          .ant-layout-header {
            padding: 0;
          }
          .ant-layout-content {
            background-color: #fff;
          }
        `}
      </style>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})
const mapDispatchToProps = (dispatch) => ({
  logout: bindActionCreators(logout, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(MyLayout)
