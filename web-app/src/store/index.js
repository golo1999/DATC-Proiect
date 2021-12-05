import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./auth-slice";
import locationSlice from "./location-slice";
import reportSlice from "./report-slice";
import reportsListSlice from "./reports-list-slice";
import userSlice from "./user-slice";
import usersListSlice from "./users-list-slice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    location: locationSlice.reducer,
    report: reportSlice.reducer,
    reportsList: reportsListSlice.reducer,
    user: userSlice.reducer,
    usersList: usersListSlice.reducer,
  },
});

export default store;
