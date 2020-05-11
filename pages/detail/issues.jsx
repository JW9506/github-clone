import withRepoBasic from "components/withRepoBasic"
import { useState, useCallback, useEffect } from "react"
import { Avatar, Button, Select, Spin } from "antd"
import dynamic from "next/dynamic"
import api from "lib/universalApi"

const GITHUB_BASE_URL = "https://api.github.com"

import SearchUser from "components/searchUser"
import { getLastUpdated } from "lib/util"

const MarkdownRenderer = dynamic(
  () =>
    import(
      /* webpackChunkName: "markdownrenderer" */ "components/markdownRenderer"
    ),
  {
    loading: () => <div>Markdown Renderer currently loading</div>,
  }
)

function IssueDetail({ issue }) {
  return (
    <div className="IssueDetail">
      <MarkdownRenderer content={issue.body} />
      <div className="actions">
        <Button href={issue.html_url} target="_blank">
          Open discussion page
        </Button>
      </div>
      <style jsx>
        {`
          .IssueDetail {
            background-color: #fafafa;
            padding: 2rem;
          }
          .actions {
            text-align: right;
          }
        `}
      </style>
    </div>
  )
}

function IssueItem({ issue }) {
  const [showDetail, setShowDetail] = useState(false)

  const toggleShowDetail = useCallback(() => {
    setShowDetail((showDetail) => !showDetail)
  }, [])

  return (
    <div>
      <div className="Issue">
        <Button
          type="primary"
          size="small"
          style={{ position: "absolute", top: "1rem", right: "1rem" }}
          onClick={toggleShowDetail}
        >
          {showDetail ? "Hide" : "Show"}
        </Button>
        <div className="avatar">
          <Avatar src={issue.user.avatar_url} shape="square" size={50} />
        </div>
        <div className="main-info">
          <h6>
            <span>{issue.title}</span>
            <p className="sub-info">
              <span>Updated at {getLastUpdated(issue.updated_at)}</span>
            </p>
          </h6>
        </div>
      </div>
      {showDetail && <IssueDetail issue={issue} />}
      <style jsx>
        {`
          .Issue {
            display: flex;
            position: relative;
            padding: 1rem;
          }
          .Issue:hover {
            background-color: #fafafa;
          }
          .Issue + .Issue {
            border-top: 1px solid #eee;
          }
          .main-info > h6 {
            max-width: 80rem;
            font-size: 1.6rem;
            padding-right: 7rem;
          }
          .avatar {
            margin-right: 2rem;
          }
          .sub-info {
            margin-bottom: 0;
          }
          .sub-info > span + span {
            display: inline-block;
            margin-left: 2rem;
            font-size: 1.2rem;
          }
        `}
      </style>
    </div>
  )
}

function makeQuery(creator, state, labels) {
  return `?${[
    creator && `creator=${creator}`,
    state && `state=${state}`,
    labels && labels.length > 0 && `labels=${labels.join(",")}`,
  ]
    .filter(Boolean)
    .join("&")}`
}

const Option = Select.Option

Issues.getInitialProps = async (appCtx) => {
  const { ctx, reduxStore } = appCtx
  const { owner, name } = ctx.query
  const issuesResp = await api.request(
    {
      url: `/repos/${owner}/${name}/issues`,
    },
    ctx.req,
    ctx.res,
    reduxStore
  )
  const initialIssues = issuesResp.data

  const labelsResp = await api.request(
    {
      // endpoint error if request from server
      url: `/repos/${owner}/${name}/labels`,
    },
    ctx.req,
    ctx.res,
    reduxStore
  )
  const initialLabels = labelsResp.data

  return { initialIssues, initialLabels, name, owner }
}

function Issues({ initialIssues, initialLabels, name, owner }) {
  const [labels, setLabels] = useState(initialLabels || [])

  useEffect(() => {
    if (labels.length === 0) {
      ;(async () => {
        try {
          const labelsResp = await fetch(
            `${GITHUB_BASE_URL}/repos/${owner}/${name}/labels`
          )
          setLabels(await labelsResp.json())
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [labels, owner, name])

  const [isFetching, setFetching] = useState(false)
  const [creator, setCreator] = useState("")
  const [state, setState] = useState("")
  const [label, setLabel] = useState([])
  const [issues, setIssues] = useState(initialIssues || [])

  const handleCreatorChange = useCallback((value) => {
    setCreator(value)
  }, [])

  const handleStateChange = useCallback((value) => {
    setState(value)
  }, [])

  const handleLabelChange = useCallback((value) => {
    setLabel(value)
  }, [])

  const handleSearch = useCallback(async () => {
    setFetching(true)
    const issueSearchResp = await api.request({
      url: `/repos/${owner}/${name}/issues${makeQuery(creator, state, label)}`,
    })
    setFetching(false)
    setIssues(issueSearchResp.data)
  }, [owner, name, makeQuery, creator, state, label])

  return (
    <div>
      <div className="search">
        <SearchUser onChange={handleCreatorChange} value={creator} />
        <Select
          style={{ width: "10rem", marginLeft: "1rem" }}
          placeholder="Status"
          onChange={handleStateChange}
          value={state}
        >
          <Option value="all">All</Option>
          <Option value="open">Open</Option>
          <Option value="closed">Closed</Option>
        </Select>
        <Select
          mode="multiple"
          style={{ width: "17rem", marginLeft: "1rem", flexGrow: 1 }}
          placeholder="Label"
          onChange={handleLabelChange}
          value={label}
        >
          {labels.length !== 0 &&
            labels.map((label) => (
              <Option key={label.id} value={label.name}>
                {label.name}
              </Option>
            ))}
        </Select>
        <Button
          style={{ marginLeft: "1rem" }}
          type="primary"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
      {isFetching ? (
        <div className="loading">
          <Spin />
        </div>
      ) : (
        <div className="Issues">
          {issues.map((issue) => (
            <IssueItem key={issue.id} issue={issue} />
          ))}
        </div>
      )}
      <style jsx>{`
        .Issues {
          border: 1px solid #eee;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
        }
        .search {
          display: flex;
          align-items: center;
        }
        .loading {
          display: flex;
          height: 40rem;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

export default withRepoBasic(Issues, "issues")
