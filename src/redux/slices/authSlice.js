// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token:
    typeof window !== "undefined" ? localStorage.getItem("token") : null, // get token from localStorage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      const token = action.payload;
      state.token = token;

      if (typeof window !== "undefined") {
        // Save in localStorage
        localStorage.setItem("token", token);

        // ✅ Save in cookie (so middleware can read it)
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

        console.log("✅ Token set in Redux + localStorage + cookie:", token);
      }
    },

    logout: (state) => {
      console.log("Logging out, previous token:", state.token);
      state.token = null;

      if (typeof window !== "undefined") {
        // Remove from localStorage
        localStorage.removeItem("token");

        // ✅ Remove cookie
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

        console.log("🚪 Token removed from Redux + localStorage + cookie");
      }
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
