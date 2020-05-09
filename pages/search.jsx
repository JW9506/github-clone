import { useRouter } from "next/router"
import Head from "next/head"
import { Row, Col, List } from "antd"
import Link from "next/link"
import clsx from "clsx"
import api from "lib/universalApi"
import { useCallback } from "react"

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

Search.getInitialProps = async (appCtx) => {
  const { ctx } = appCtx
  const { query, lang, sort, page, order } = ctx.query
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

  const { query, sort, order, lang } = router.query

  const doSearch = useCallback(
    (queryConfig) => {
      const baseQueryConfig = {
        query,
        sort,
        order,
        lang,
      }
      queryConfig = { ...baseQueryConfig, ...queryConfig }
      router.push({
        pathname: "/search",
        query: queryConfig,
      })
    },
    [query, sort, order, lang]
  )

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
              renderItem={(item) => (
                <List.Item>
                  <a
                    className={clsx({
                      active: lang === item,
                    })}
                    onClick={() => doSearch({ lang: item })}
                  >
                    {item}
                  </a>
                </List.Item>
              )}
            />
            <List
              bordered
              header={<span className="list-header">Order</span>}
              dataSource={SORT_TYPES}
              renderItem={(item) => {
                let active = false
                if (item.name === "Best Match" && !sort) {
                  active = true
                } else if (item.value === sort && item.order === order) {
                  active = true
                }
                return (
                  <List.Item>
                    <a
                      className={clsx({ active })}
                      onClick={() =>
                        doSearch({
                          sort: item.value,
                          order: item.order,
                        })
                      }
                    >
                      {item.name}
                    </a>
                  </List.Item>
                )
              }}
            />
          </Col>
        </Row>
      </div>
      <style jsx>
        {`
          .active {
            border-left: 2px solid #e36209;
            font-weight: 1000;
          }
        `}
      </style>
    </>
  )
}

export default Search
