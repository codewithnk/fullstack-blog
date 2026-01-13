import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const tokenFromStorage = localStorage.getItem("accessToken");
const initialState = {
  accessToken: tokenFromStorage,
  user: tokenFromStorage ? jwtDecode(tokenFromStorage) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const token = action.payload;
      state.accessToken = token;
      state.user = jwtDecode(token);
      localStorage.setItem("accessToken", token);
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
