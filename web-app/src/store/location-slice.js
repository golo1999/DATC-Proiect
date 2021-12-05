import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminLocation: { latitude: 51.509865, longitude: -0.118092 },
  reportsLocationList: [],
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    addReportLocation: (state, action) => {
      const newReportLocation = action.payload.newReportLocation;

      state.reportsLocationList.push(newReportLocation);
    },
    clearReportsLocationList: (state) => {
      if (state.reportsLocationList.length > 0) {
        state.reportsLocationList = [];
      }
    },
    setAdminLocation: (state, action) => {
      const newLocation = action.payload.newLocation;

      if (state.adminLocation !== newLocation) {
        state.adminLocation = newLocation;
      }
    },
    setReportsLocationList: (state, action) => {
      const newReportsLocationList = action.payload.newReportsLocationList;

      if (state.reportsLocationList !== newReportsLocationList) {
        state.reportsLocationList = newReportsLocationList;
      }
    },
  },
});

export const locationActions = locationSlice.actions;

export default locationSlice;
