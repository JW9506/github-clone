import { configureStore } from "@reduxjs/toolkit"
import { reducer as user } from "./user"

const reducer = {
  user,
}

export const createStore = (preloadedState) => {
  return configureStore({ reducer, preloadedState })
}
