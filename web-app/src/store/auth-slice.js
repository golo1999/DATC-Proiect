// NPM
import { createSlice } from "@reduxjs/toolkit";

// Models
import AdminPersonalInformation from "../models/AdminPersonalInformation";

// type InitialState = {};

const initialAuthState = { admin: null, isAuthenticated: false };

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    authenticateAdmin: (state, action) => {
      const newAuthenticatedAdmin = action.payload.authenticatedAdmin;

      state.admin = newAuthenticatedAdmin;
      state.isAuthenticated = true;
    },
    signOutAdmin: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
