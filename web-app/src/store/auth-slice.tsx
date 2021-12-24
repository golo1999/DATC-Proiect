// NPM
import { createSlice } from "@reduxjs/toolkit";

// Models
import AdminPersonalInformation from "../models/AdminPersonalInformation";

type InitialState = {
  admin: AdminPersonalInformation | null;
  isAuthenticated: boolean;
};

const initialAuthState: InitialState = { admin: null, isAuthenticated: false };

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    authenticateAdmin: (state, action) => {
      const newAuthenticatedAdmin: AdminPersonalInformation =
        action.payload.authenticatedAdmin;

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
