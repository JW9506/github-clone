import App from "next/app"
import withRedux from "lib/withRedux"
import "antd/dist/antd.css"

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
    return <Component {...pageProps} reduxStore={reduxStore} />
  }
}

export default withRedux(MyApp)
