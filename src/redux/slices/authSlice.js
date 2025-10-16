// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null, // get token from localStorage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      console.log("Token set in Redux:", state.token); // ✅ logs token in Redux
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload);
        console.log(
          "Token saved in localStorage:",
          localStorage.getItem("token")
        ); // ✅ logs token in localStorage
      }
    },

    logout: (state) => {
      console.log("Logging out, previous token:", state.token);
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        console.log("Token removed from localStorage");
      }
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
