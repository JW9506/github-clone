const webpack = require("webpack")
const withCss = require("@zeit/next-css")
const nextBundleAnalyzer = require("@next/bundle-analyzer")
const config = require("./config")

if (typeof require !== "undefined") {
  require.extensions[".css"] = (file) => {}
}

const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize"

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

module.exports = withBundleAnalyzer(
  withCss({
    webpack: (config) => {
      config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
      return config
    },
    publicRuntimeConfig: {
      GITHUB_OAUTH_URL,
      OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${config.github.client_id}`,
    },
    analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: "static",
        reportFilename: "../bundles/server.html",
      },
      browser: {
        analyzerMode: "static",
        reportFilename: "../bundles/client.html",
      },
    },
  })
)
