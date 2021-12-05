import { getDatabase, ref, set } from "firebase/database";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { reportActions } from "../store/report-slice";
import { reportsListActions } from "../store/reports-list-slice";

import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { FaAngleRight, FaCheck } from "react-icons/fa";

import classes from "./ReportItem.module.css";

const ReportItem = (props) => {
  const adminPersonalInformation = useSelector((state) => state.auth.admin);

  const db = getDatabase();

  const dispatch = useDispatch();

  const history = useHistory();

  const report = props.report;

  const reportDetailsRef = ref(
    db,
    "usersList/" + report.userId + "/personalReports/" + report.reportId
  );

  const [modalIsVisible, setModalIsVisible] = useState(false);

  const [modalMessage, setModalMessage] = useState("");

  const [isChecked, setIsChecked] = useState(report.checkedStatus);

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
    dispatch(reportActions.setSelectedReport({ selectedReport: report }));
    history.push("/reports/" + report.reportId);
  };

  const closeModalHandler = () => {
    setModalMessage("");
    setModalIsVisible(false);
  };

  const modifyReportStatusHandler = () => {
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
      checkedBy: !isChecked ? adminPersonalInformation.id : null,
      checkedStatus: !isChecked,
      dateTime,
      note: report.note ? report.note : null,
      reportId: report.reportId,
      userId: report.userId,
    };

    set(reportDetailsRef, editedReport);
    setIsChecked((previousValue) => !previousValue);
    dispatch(reportsListActions.updateReport({ updatedReport: editedReport }));
    closeModalHandler();
  };

  const showModalHandler = () => {
    const action = isChecked ? "unsolved" : "solved";

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
          <Button variant="dark" onClick={modifyReportStatusHandler}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Card className={classes.card}>
        <Card.Body className={classes["card-body"]}>
          <Container>
            {/* XL, LG, MD LAYOUT */}
            <Row className="d-none d-md-flex">
              <Col className={classes["report-category-container"]}>
                {report.category === 0
                  ? "Danger"
                  : report.category === 1
                  ? "Garbage"
                  : report.category === 2
                  ? "Pothole"
                  : "Vandalism"}
              </Col>
              <Col className={classes["report-date-time-container"]}>
                {reportParsedDateTime}
              </Col>
              <Col className={classes["icons-container"]}>
                <FaCheck
                  className={
                    isChecked
                      ? classes["report-status-icon"]
                      : classes["report-status-icon-unchecked"]
                  }
                  onClick={checkReportHandler}
                />
                <FaAngleRight
                  className={classes["report-details-icon"]}
                  onClick={checkReportDetailsHandler}
                />
              </Col>
            </Row>
            {/* SM, XS LAYOUT */}
            <Row className="d-flex d-sm-flex d-md-none">
              <Col>
                <Row>
                  <Col className={classes["report-category-container"]}>
                    {report.category === 0
                      ? "Danger"
                      : report.category === 1
                      ? "Garbage"
                      : report.category === 2
                      ? "Pothole"
                      : "Vandalism"}
                  </Col>
                </Row>
                <Row>
                  <Col
                    className={
                      classes["report-date-time-container-second-layout"]
                    }
                  >
                    {reportParsedDateTime}
                  </Col>
                </Row>
              </Col>
              <Col className={classes["icons-container"]}>
                <FaCheck
                  className={
                    isChecked
                      ? classes["report-status-icon"]
                      : classes["report-status-icon-unchecked"]
                  }
                  onClick={checkReportHandler}
                />
                <FaAngleRight
                  className={classes["report-details-icon"]}
                  onClick={checkReportDetailsHandler}
                />
              </Col>
            </Row>
          </Container>
          {/* <div className={classes["report-category-container"]}>
            {report.category === 0
              ? "Danger"
              : report.category === 1
              ? "Garbage"
              : report.category === 2
              ? "Pothole"
              : "Vandalism"}
          </div> */}
          {/* <div className={classes["report-date-time-container"]}>
            {reportParsedDateTime}
          </div> */}
          {/* <div className={classes["icons-container"]}>
            <FaCheck
              className={
                isChecked
                  ? classes["report-status-icon"]
                  : classes["report-status-icon-unchecked"]
              }
              onClick={checkReportHandler}
            />
            <FaAngleRight
              className={classes["report-details-icon"]}
              onClick={checkReportDetailsHandler}
            />
          </div> */}
        </Card.Body>
      </Card>
    </li>
  );
};

export default ReportItem;
