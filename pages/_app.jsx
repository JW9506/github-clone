import App from "next/app"
import { Provider } from "react-redux"
import withRedux from "lib/withRedux"
import Router from "next/router"
import "antd/dist/antd.css"

import Layout from "./Layout"
import PageLoading from "components/pageLoading"

class MyApp extends App {
  static async getInitialProps(appCtx) {
    const { Component, ctx } = appCtx
    let appProps = {}
    if (Component.getInitialProps) {
      const pageProps = await Component.getInitialProps(appCtx)
      appProps = { pageProps }
    }
    return appProps
  }

  state = {
    loading: false,
  }

  startLoading = () => {
    this.setState({ loading: true })
  }

  stopLoading = () => {
    this.setState({ loading: false })
  }

  componentDidMount() {
    Router.events.on("routeChangeStart", this.startLoading)
    Router.events.on("routeChangeComplete", this.stopLoading)
    Router.events.on("routeChangeError", this.stopLoading)
  }

  componentWillUnmount() {
    Router.events.off("routeChangeStart", this.startLoading)
    Router.events.off("routeChangeComplete", this.stopLoading)
    Router.events.off("routeChangeError", this.stopLoading)
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props
    const { loading } = this.state
    return (
      <Provider store={reduxStore}>
        {loading && <PageLoading />}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    )
  }
}

export default withRedux(MyApp)
