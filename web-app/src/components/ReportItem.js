import React from "react";

import { Card } from "react-bootstrap";
import { FaAngleRight, FaCheck } from "react-icons/fa";

import classes from "./ReportItem.module.css";

const ReportItem = (props) => {
  const report = props.report;

  const reportDateTime = report.dateTime;

  const reportParsedDateTime =
    (reportDateTime.day < 10 ? "0" + reportDateTime.day : reportDateTime.day) +
    "/" +
    (reportDateTime.month < 10
      ? "0" + reportDateTime.month
      : reportDateTime.month) +
    "/" +
    reportDateTime.year +
    " " +
    (reportDateTime.hour < 10
      ? "0" + reportDateTime.hour
      : reportDateTime.hour) +
    ":" +
    (reportDateTime.minute < 10
      ? "0" + reportDateTime.minute
      : reportDateTime.minute) +
    ":" +
    (reportDateTime.second < 10
      ? "0" + reportDateTime.second
      : reportDateTime.second);

  const checkReportHandler = () => {
    alert("check report clicked");
  };

  const checkReportDetailsHandler = () => {
    alert("check report details clicked " + report.reportId);
  };

  return (
    <li>
      <Card className={classes.card}>
        <Card.Body className={classes["card-body"]}>
          <div className={classes["report-category-container"]}>
            {`Category ` + report.category}
          </div>
          <div className={classes["report-date-time-container"]}>
            {reportParsedDateTime}
          </div>
          <div className={classes["icons-container"]}>
            <FaCheck
              className={
                report.checkedStatus
                  ? classes["report-status-icon"]
                  : classes["report-status-icon-unchecked"]
              }
              onClick={checkReportHandler}
            />
            <FaAngleRight onClick={checkReportDetailsHandler} />
          </div>
        </Card.Body>
      </Card>
    </li>
  );
};

export default ReportItem;
