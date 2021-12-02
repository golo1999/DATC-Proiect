import { createSlice } from "@reduxjs/toolkit";

const initialState = { usersList: [] };

const usersListSlice = createSlice({
  name: "usersList",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const newUser = action.payload.user;

      state.usersList.push(newUser);
    },
    clearUsersList: (state) => {
      state.usersList = [];
    },
    removeUser: (state, action) => {},
    setUsersList: (state, action) => {
      const newUsersList = action.payload.usersList;

      state.usersList = newUsersList;
    },
  },
});

export const usersListActions = usersListSlice.actions;

export default usersListSlice;
