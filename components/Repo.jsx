import Link from "next/link"
import { StarFilled } from "@ant-design/icons"
import { getLastUpdated } from "lib/util"

function getLicense(license) {
  return license ? `${license.spdx_id} license` : ""
}

const Repo = ({ repo }) => {
  return (
    <div className="Repo">
      <div className="basic-ifno">
        <h3 className="repo-title">
          <Link href={`/detail?owner=${repo.owner.login}&name=${repo.name}`}>
            <a>{repo.full_name}</a>
          </Link>
        </h3>
        <p className="repo-desc">{repo.description}</p>
        <p className="other-info">
          {repo.license && (
            <span className="license">{getLicense(repo.license)}</span>
          )}
          <span className="last-updated">
            {getLastUpdated(repo.updated_at)}
          </span>
          <span className="open-issues">{repo.open_issues_count} issues</span>
        </p>
      </div>
      <div className="lang-star">
        <span className="lang">{repo.language}</span>
        <span className="stars">
          {repo.stargazers_count} <StarFilled />
        </span>
      </div>
      <style jsx>{`
        .Repo {
          display: flex;
          justify-content: space-between;
        }
        .repo-title {
          font-size: 2rem;
        }
        .lang-star {
          display: flex;
        }
        .lang-star > span {
          width: 12rem;
          text-align: right;
        }
        .other-info > span:not(:first-child) {
          margin-left: 1rem;
        }
        .repo-desc {
          width: 40rem;
        }
      `}</style>
    </div>
  )
}

export default Repo
