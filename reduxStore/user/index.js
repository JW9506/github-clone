import { configureStore, createSlice } from "@reduxjs/toolkit"

const user = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    setUser: (state, action) => {
      state = action.payload
    },
  },
})

export const { reducer } = user
export const { setUser } = user.actions
