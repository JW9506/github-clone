const { requestGithub } = require("./universalApi")
const { default: Axios } = require("axios")
const GITHUB_BASE_URL = "https://api.github.com"

module.exports = (server) => {
  server.use(async (ctx, next) => {
    const path = ctx.url
    const method = ctx.method
    const prefix = /^\/github/
    if (!!path.match(prefix)) {
      const githubPath = path.replace(prefix, "")
      const githubAuth = ctx.session.githubAuth || {}
      const { access_token, token_type } = githubAuth
      let headers = {}
      if (access_token) {
        headers["Authorization"] = `${token_type} ${access_token}`
      }
      let result = {}
      try {
        result = await requestGithub(
          method,
          githubPath,
          ctx.req.body || {},
          headers
        )
        ctx.body = result.data
        ctx.set("Content-Type", "application/json")
      } catch (error) {
        console.error(error)
        ctx.status = result.status || 500
      }
    } else {
      await next()
    }
  })
}
