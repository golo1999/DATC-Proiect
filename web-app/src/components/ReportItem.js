import { set } from "firebase/database";
import React, { useState } from "react";

import { Button, Card, Modal } from "react-bootstrap";
import { FaAngleRight, FaCheck } from "react-icons/fa";

import { db } from "../Firebase";

import classes from "./ReportItem.module.css";

const ReportItem = (props) => {
  const [modalIsVisible, setModalIsVisible] = useState(false);

  const [modalMessage, setModalMessage] = useState("");

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
    showModalHandler();
  };

  const checkReportDetailsHandler = () => {
    alert("check report details clicked " + report.reportId);
  };

  const closeModalHandler = () => {
    setModalMessage("");
    setModalIsVisible(false);
  };

  const modifyReportStatusHandler = () => {
    const userReportRef = db.ref(
      "usersList/" + report.userId + "/personalReports/" + report.reportId
    );

    const dateTime = {
      day: reportDateTime.day,
      dayName: reportDateTime.dayName,
      hour: reportDateTime.hour,
      minute: reportDateTime.minute,
      month: reportDateTime.month,
      monthName: reportDateTime.monthName,
      second: reportDateTime.second,
      year: reportDateTime.year,
    };

    const editedReport = {
      category: report.category,
      checkedStatus: !report.checkedStatus,
      dateTime,
      note: report.note ? report.note : null,
      reportId: report.reportId,
      userId: report.userId,
    };

    set(userReportRef, editedReport);

    closeModalHandler();
  };

  const showModalHandler = () => {
    const action = report.checkedStatus ? "unsolved" : "solved";

    setModalMessage(
      "Are you sure you want to mark the report as " + action + "?"
    );
    setModalIsVisible(true);
  };

  return (
    <li>
      <Modal
        className={classes.modal}
        show={modalIsVisible}
        onHide={closeModalHandler}
      >
        <Modal.Header className={classes["modal-header"]} closeButton>
          <Modal.Title>{modalMessage}</Modal.Title>
        </Modal.Header>
        <Modal.Footer className={classes["modal-footer"]}>
          <Button variant="secondary" onClick={closeModalHandler}>
            Close
          </Button>
          <Button variant="primary" onClick={modifyReportStatusHandler}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
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
