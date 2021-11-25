// just for testing: it's not used

import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {},
});

export const authActions = authSlice.actions;

export default authSlice;
