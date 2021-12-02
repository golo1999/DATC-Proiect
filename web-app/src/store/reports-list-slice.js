import { createSlice } from "@reduxjs/toolkit";

const initialState = { reportsList: [] };

const reportsListSlice = createSlice({
  name: "reportsList",
  initialState,
  reducers: {
    addReport: (state, action) => {
      const newReport = action.payload.report;

      state.reportsList.push(newReport);
    },
    clearReportsList: (state) => {
      state.reportsList = [];
    },
    removeReport: (state, action) => {},
    setReportsList: (state, action) => {
      const newReportsList = action.payload.reportsList;

      state.reportsList = newReportsList;
    },
  },
});

export const reportsListActions = reportsListSlice.actions;

export default reportsListSlice;
