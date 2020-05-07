import { configureStore, createSlice } from "@reduxjs/toolkit"

const user = createSlice({
  name: "user",
  initialState: {
    username: "",
  },
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload
    },
  },
})

export const { reducer } = user
export const { setUser } = user.actions
