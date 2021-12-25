// NPM
import { getDatabase, ref, set } from "firebase/database";
import React, { useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

// Redux
import { reportActions } from "../../store/report-slice";
import { reportsListActions } from "../../store/reports-list-slice";

// APIs
import { updateUserLevel } from "../../lib/api";

// Models
import CustomDateTime from "../../models/CustomDateTime";
import Report from "../../models/Report";

// Utility
import {
  getFormattedCategoryName,
  getFormattedDateTime,
} from "../../utility/custom-methods";

// Bootstrap
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { FaAngleRight, FaCheck } from "react-icons/fa";

// Custom CSS
import classes from "./ReportItem.module.css";

type Props = { report: Report };

const ReportItem = ({ report }: Props) => {
  const adminPersonalInformation = useSelector(
    (state: RootStateOrAny) => state.auth.admin
  );

  const db = getDatabase();

  const dispatch = useDispatch();

  const history = useHistory();

  const reportDetailsRef = ref(
    db,
    `usersList/${report.userId}/personalReports/${report.reportId}`
  );

  const [modalIsVisible, setModalIsVisible] = useState(false);

  const [modalMessage, setModalMessage] = useState("");

  const [isChecked, setIsChecked] = useState(report.checkStatus);

  const reportDateTime = report.dateTime;

  const reportParsedDateTime = getFormattedDateTime(reportDateTime);

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
    const dateTime = new CustomDateTime(
      reportDateTime.day,
      reportDateTime.dayName,
      reportDateTime.hour,
      reportDateTime.minute,
      reportDateTime.month,
      reportDateTime.monthName,
      reportDateTime.second,
      reportDateTime.year
    );

    const editedReport = new Report(
      report.category,
      !isChecked ? adminPersonalInformation.id : null,
      !isChecked,
      dateTime,
      report.location,
      report.note,
      report.reportId,
      report.userId
    );

    set(reportDetailsRef, editedReport);
    setIsChecked((previousValue: boolean) => !previousValue);
    dispatch(reportsListActions.updateReport({ updatedReport: editedReport }));
    updateUserLevel(editedReport.userId);
    closeModalHandler();
  };

  const showModalHandler = () => {
    const action = isChecked ? "unsolved" : "solved";

    setModalMessage(`Are you sure you want to mark the report as ${action}?`);
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
                {getFormattedCategoryName(report.category)}
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
                    {getFormattedCategoryName(report.category)}
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
        </Card.Body>
      </Card>
    </li>
  );
};

export default ReportItem;
