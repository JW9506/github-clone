import { useRouter } from "next/router"
import Head from "next/head"
import { Row, Col, List, Pagination } from "antd"
import Link from "next/link"
import api from "lib/universalApi"
import { memo, isValidElement } from "react"

import Repo from "components/Repo"

const LANGUAGES = ["JavaScript", "HTML", "CSS", "TypeScript", "Java", "Python"]
const SORT_TYPES = [
  {
    name: "Best Match",
  },
  {
    name: "Most Stars",
    value: "stars",
    order: "desc",
  },
  {
    name: "Fewest Stars",
    value: "stars",
    order: "asc",
  },
  {
    name: "Most Forks",
    value: "forks",
    order: "asc",
  },
  {
    name: "Fewest Forks",
    value: "forks",
    order: "desc",
  },
]

const activeStyle = {
  paddingLeft: "1rem",
  borderLeft: "2px solid #e36209",
  fontWeight: 1000,
}

const leftSideFilterMenuStyle = { marginBottom: "4rem" }

function noop() {}

const PER_PAGE = 20

const FilterLink = memo(({ query, sort, order, lang, name, page, active }) => {
  let queryString = `?query=${query}`
  if (lang) queryString += `&lang=${lang}`
  if (sort) queryString += `&sort=${sort}&order=${order || "desc"}`
  if (page) queryString += `&page=${page}`
  queryString += `&per_page=${PER_PAGE}`
  return (
    <Link href={`/search${queryString}`}>
      {isValidElement(name) ? (
        name
      ) : (
        <a style={active ? activeStyle : null}>{name}</a>
      )}
    </Link>
  )
})

Search.getInitialProps = async (appCtx) => {
  const { ctx } = appCtx
  const { query, lang, sort, page, order, per_page } = ctx.query
  if (!query) {
    return {
      repos: {
        total_count: 0,
      },
    }
  }
  let queryString = `?q=${query}`
  if (lang) queryString += `+language:${lang}`
  if (sort) queryString += `&sort=${sort}&order=${order || "desc"}`
  if (page) queryString += `&page=${page}`
  queryString += `&per_page=${per_page || PER_PAGE}`

  const { data: repos } = await api.request(
    {
      url: `/search/repositories${queryString}`,
    },
    ctx.req,
    ctx.res
  )

  return { repos }
}

function Search({ repos }) {
  const router = useRouter()

  const { ...querys } = router.query
  const { query, sort, order, lang, page } = router.query

  return (
    <>
      <Head>
        <title>Github Clone Search</title>
      </Head>
      <div className="Search">
        <Row gutter={20}>
          <Col span={6}>
            <List
              bordered
              header={<span className="list-header">Language</span>}
              dataSource={LANGUAGES}
              style={leftSideFilterMenuStyle}
              renderItem={(item) => {
                const active = lang === item
                return (
                  <List.Item>
                    {active ? (
                      <span style={active ? activeStyle : null}>{item}</span>
                    ) : (
                      <FilterLink
                        {...querys}
                        query={query}
                        lang={item}
                        name={item}
                        active={active}
                      />
                    )}
                  </List.Item>
                )
              }}
            />
            <List
              bordered
              header={<span className="list-header">Order</span>}
              dataSource={SORT_TYPES}
              style={leftSideFilterMenuStyle}
              renderItem={(item) => {
                let active = false
                if (item.name === "Best Match" && !sort) {
                  active = true
                } else if (item.value === sort && item.order === order) {
                  active = true
                }
                return (
                  <List.Item>
                    {active ? (
                      <span style={active ? activeStyle : null}>
                        {item.name}
                      </span>
                    ) : (
                      <FilterLink
                        {...querys}
                        query={query}
                        sort={item.value}
                        order={item.order}
                        name={item.name}
                        active={active}
                      />
                    )}
                  </List.Item>
                )
              }}
            />
          </Col>
          {!repos ? (
            <div>No result</div>
          ) : (
            <Col span={18}>
              <h3 className="repos-title">Result count: {repos.total_count}</h3>
              {repos.items.map((repo) => (
                <Repo key={repo.id} repo={repo} />
              ))}
              <div className="pagination">
                <Pagination
                  pageSize={PER_PAGE}
                  current={+(page || 1)}
                  total={Math.min(1000, repos.total_count)}
                  onChange={noop}
                  itemRender={(page, type, ol) => {
                    const p =
                      type === "page"
                        ? page
                        : type === "prev"
                        ? page - 1
                        : page + 1
                    const name = type === "page" ? page : ol
                    return <FilterLink {...querys} page={p} name={name} />
                  }}
                />
              </div>
            </Col>
          )}
        </Row>
      </div>
      <style jsx>
        {`
          .Search {
            padding: 2rem 0;
          }
          .list-header {
            font-weight: 800;
            font-size: 1.6rem;
          }
          .repos-title {
            border-bottom: 1px solid #eee;
            font-size: 2.4rem;
            line-height: 5rem;
          }
          .pagination {
            padding: 2rem;
            text-align: center;
          }
        `}
      </style>
    </>
  )
}

export default Search
