import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./auth-slice";
import reportSlice from "./report-slice";
import reportsListSlice from "./reports-list-slice";
import userSlice from "./user-slice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    report: reportSlice.reducer,
    reportsList: reportsListSlice.reducer,
    user: userSlice.reducer,
  },
});

export default store;
