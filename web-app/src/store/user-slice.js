// https://www.youtube.com/watch?v=x-FBwszlA3U

import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: null };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      if (state.user !== action.payload.selectedUser) {
        state.user = action.payload.selectedUser;
      }
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
