import React from "react"
import { createStore } from "reduxStore"

const isServer = typeof window === "undefined"
const __NEXT_REDUX_STORE__ = "__NEXT_REDUX_STORE__"

function getOrCreateStore(initialState) {
  if (isServer) {
    return createStore(initialState)
  }
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = createStore(initialState)
  }
  return window[__NEXT_REDUX_STORE__]
}

function withRedux(Comp) {
  return class WithReduxApp extends React.Component {
    static async getInitialProps(ctx) {
      const reduxStore = getOrCreateStore()
      ctx.reduxStore = reduxStore
      let appProps = {}
      if (typeof Comp.getInitialProps === "function") {
        appProps = await Comp.getInitialProps(ctx)
      }
      return {
        ...appProps,
        initialReduxState: reduxStore.getState(),
      }
    }

    constructor(props) {
      super(props)
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render() {
      const { Component, pageProps, ...rest } = this.props
      return (
        <Comp
          Component={Component}
          pageProps={pageProps}
          reduxStore={this.reduxStore}
          {...rest}
        />
      )
    }
  }
}

export default withRedux
