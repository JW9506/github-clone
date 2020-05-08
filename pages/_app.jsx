import App from "next/app"
import { Provider } from "react-redux"
import withRedux from "lib/withRedux"
import "antd/dist/antd.css"

import Layout from "./Layout"

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let appProps = {}
    if (Component.getInitialProps) {
      const pageProps = await Component.getInitialProps(ctx)
      appProps = { pageProps }
    }
    return appProps
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Layout>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Layout>
    )
  }
}

export default withRedux(MyApp)
