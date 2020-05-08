import config from "next/config"
const { publicRuntimeConfig } = config()
const { OAUTH_URL } = publicRuntimeConfig

import { connect } from "react-redux"
import { useState, useCallback } from "react"
import { Button, Layout, Input, Avatar } from "antd"
import { GithubOutlined, UserOutlined } from "@ant-design/icons"
const { Header, Footer, Content } = Layout

import Container from "components/container"

const githubIconStyle = {
  fontSize: "2.5rem",
  color: "white",
  marginRight: "1rem",
}

const footerStyle = {
  textAlign: "center",
}

const MyLayout = ({ children, user }) => {
  const [search, setSearch] = useState("")

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value)
  }, [])

  const handleOnSearch = useCallback(() => {}, [])

  return (
    <Layout>
      <Header>
        <Container comp={<div className="cm-header" />}>
          <div className="header-left">
            <GithubOutlined style={githubIconStyle} />
            <Input.Search
              placeholder="Search Repo"
              value={search}
              onChange={handleSearchChange}
              onSearch={handleOnSearch}
            />
          </div>

          <div className="header-right">
            <div className="user">
              {user && user.id ? (
                <a href="/">
                  <Avatar size={40} src={user.avatar_url} />
                </a>
              ) : (
                <a href={OAUTH_URL}>
                  <Avatar size={40} icon={<UserOutlined />} />
                </a>
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
          .ant-layout,
          #__next {
            height: 100%;
          }
          .ant-layout-header {
            padding: 0;
          }
        `}
      </style>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})
export default connect(mapStateToProps)(MyLayout)
