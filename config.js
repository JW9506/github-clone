const { config } = require("dotenv")
config({
  path: ".env.development.local",
})

module.exports = {
  github: {
    request_token_url: "https://github.com/login/oauth/access_token",
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
  },
}
