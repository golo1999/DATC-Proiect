import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = { admin: null, isAuthenticated: false };

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    authenticateAdmin: (state, action) => {
      const newAuthenticatedAdmin = action.payload.authenticatedAdmin;

      state.isAuthenticated = true;
      state.admin = newAuthenticatedAdmin;
    },
    signOutAdmin: (state) => {
      state.isAuthenticated = false;
      state.admin = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
