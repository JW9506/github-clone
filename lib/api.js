const { default: Axios } = require("axios")
const github_base_url = "https://api.github.com"

module.exports = (server) => {
  server.use(async (ctx, next) => {
    const path = ctx.url
    const prefix = /^\/github/
    if (!!path.match(prefix)) {
      const githubAuth = ctx.session.githubAuth
      const githubPath = `${github_base_url}${path.replace(prefix, "")}`
      const { access_token, token_type } = githubAuth
      let headers = {}
      if (access_token) {
        headers["Authorization"] = `${token_type} ${access_token}`
      }
      try {
        const result = await Axios.get(githubPath, {
          headers,
        })
        if (result.status === 200) {
          ctx.body = result.data
          ctx.set("Content-Type", "application/json")
        } else {
          ctx.status = result.status
          ctx.body = { success: false }
        }
      } catch (error) {
        console.error("Proxy to github query error")
      }
    } else {
      await next()
    }
  })
}
