import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserAPI } from "../../api";

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchUserAPI();
      return res.data;
    } catch (err) {
      const backend = err.response?.data;
      const message =
        (backend && typeof backend === "object" && (backend.message || backend.error)) ||
        (typeof backend === "string" ? backend : null) ||
        err.message ||
        "Failed to fetch user.";
      return rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    pdfCount: 0,
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    logout(state) {
      localStorage.removeItem("invoiceData");
      localStorage.removeItem("authToken");
      state.user = null;
      state.isAuthenticated = false;
      state.pdfCount = 0;
      state.loading = false;
      state.error = null;
      state.initialized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.initialized = true;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
