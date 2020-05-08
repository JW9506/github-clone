import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import Axios from "axios"

const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    const result = await Axios.post("/logout")
    if (result.status !== 200) {
      throw new Error()
    }
  } catch (error) {
    return thunkAPI.rejectWithValue()
  }
  return
})

const user = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    loading: "idle",
  },
  reducers: {
    setUser: (state, action) => {
      state = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.pending, (state) => {
      state.loading = "pending"
    })
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = "idle"
      state.userInfo = null
    })
    builder.addCase(logout.rejected, (state) => {
      state.loading = "rejected"
    })
  },
})

export const { reducer } = user
export const { setUser } = user.actions
export { logout }
