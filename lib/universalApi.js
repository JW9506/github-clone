const { default: Axios } = require("axios")
const { setUser } = require("../reduxStore/user")

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
      throw Error("status is not 200")
    }
  } catch (error) {
    throw error
  }
  return result
}

const isServer = typeof window === "undefined"

async function request(config, req, res, reduxStore) {
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
    try {
      return await requestGithub(method, url, data, headers)
    } catch (error) {
      console.error(
        `Request to github/${url} returned status code ${error.response.status}`
      )
      return {}
    }
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
      reduxStore.dispatch(setUser(null))
      return {}
    }
    return result
  }
}

module.exports = { request, requestGithub }
