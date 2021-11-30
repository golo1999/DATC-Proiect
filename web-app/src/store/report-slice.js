import { createSlice } from "@reduxjs/toolkit";

const initialState = { report: null };

const reportSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSelectedReport: (state, action) => {
      if (state.report !== action.payload.selectedReport) {
        state.report = action.payload.selectedReport;
      }
    },
  },
});

export const reportActions = reportSlice.actions;

export default reportSlice;
