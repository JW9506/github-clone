import withRepoBasic from "components/withRepoBasic"
import { useState, useCallback } from "react"
import { Avatar, Button } from "antd"
import dynamic from "next/dynamic"
import api from "lib/universalApi"
import moment from "moment"

const MarkdownRenderer = dynamic(
  () =>
    import(
      /* webpackChunkName: "markdownrenderer" */ "components/markdownRenderer"
    ),
  {
    loading: () => <div>Markdown Renderer currently loading</div>,
  }
)

function getLastUpdated(time) {
  return moment(time).fromNow()
}

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

Issues.getInitialProps = async (appCtx) => {
  const { ctx, reduxStore } = appCtx
  const { owner, name } = ctx.query
  const { data } = await api.request(
    {
      url: `/repos/${owner}/${name}/issues`,
    },
    ctx.req,
    ctx.res,
    reduxStore
  )
  const issues = data
  return { issues }
}

function Issues({ issues }) {
  if (typeof window !== "undefined") {
    console.log(issues)
  }
  if (!issues) return <div>Fetch issues failed</div>
  return (
    <div className="Issues">
      {issues.map((issue) => (
        <IssueItem key={issue.id} issue={issue} />
      ))}
      <style jsx>{`
        .Issues {
          border: 1px solid #eee;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  )
}

export default withRepoBasic(Issues, "issues")
