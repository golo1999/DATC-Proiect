import React from "react";
import { useSelector } from "react-redux";

import classes from "./ReportDetails.module.css";

const ReportDetails = (props) => {
  const selectedReport = useSelector((state) => state.report.report);

  console.log(selectedReport);

  return <div>{selectedReport.reportId}</div>;
};

export default ReportDetails;
