const { default: Axios } = require("axios")

const GITHUB_BASE_URL = "https://api.github.com"

async function requestGithub(method, url, data, headers) {
  let result
  try {
    result = await Axios({
      method,
      url: `${GITHUB_BASE_URL}${url}`,
      data,
      headers,
    })
    if (result.status !== 200) {
      throw Error
    }
  } catch (error) {
    console.error("request to github failed")
  }
  return result.data
}

const isServer = typeof window === "undefined"

async function request(config, req, res) {
  if (!config.url) {
    throw new Error("url must be provided")
  }
  const baseConfig = {
    method: "GET",
    data: {},
  }
  const { url, method, data } = { ...baseConfig, ...config }
  if (isServer) {
    const session = req.session
    const { token_type, access_token } = session.githubAuth || {}
    const headers = {}
    if (access_token) {
      headers["Authorization"] = `${token_type} ${access_token}`
    }
    return await requestGithub(method, url, data, headers)
  } else {
    let result
    try {
      result = await Axios({
        method,
        url: `/github${url}`,
        data,
      })
      if (result.status !== 200) {
        throw Error
      }
    } catch (error) {
      console.error("request to github failed")
    }
    return result.data
  }
}

module.exports = { request }
