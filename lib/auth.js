const { default: Axios } = require("axios")
const config = require("../config")
const { request_token_url, client_id, client_secret } = config.github

module.exports = (server) => {
  server.use(async (ctx, next) => {
    if (ctx.path === "/auth") {
      const code = ctx.query.code
      if (!code) {
        ctx.body = { status: "error", message: "code must be provided" }
        return
      }
      const result = await Axios.post(
        request_token_url,
        {
          client_id,
          client_secret,
          code,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      if (result.status === 200 && !(result.data && result.data.error)) {
        ctx.session.githubAuth = result.data
        const { access_token, token_type } = result.data
        const userInfoResp = await Axios.get("https://api.github.com/user", {
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
        })
        ctx.session.userInfo = userInfoResp.data
        ctx.redirect("/")
      } else {
        const errorMsg = (result.data && result.data.error) || result.status
        ctx.body = {
          status: "error",
          message: `request token failed ${errorMsg}`,
        }
      }
    } else {
      await next()
    }
  })
}
