import { getDatabase, onValue, ref, set } from "firebase/database";
import React, { useCallback, useEffect, useState } from "react";
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

  // const { REACT_APP_REALTIME_DATABASE_URL: DATABASE_URL } = process.env;

  const getNumberOfSolvedReports = useCallback(
    async (userId) => {
      const reportsListRef = ref(db, `usersList/${userId}/personalReports`);

      let numberOfSolvedReports = 0;

      onValue(reportsListRef, (snapshot) => {
        const data = snapshot.val();

        const personalReportsList = Object.values(data);

        personalReportsList.forEach((report) => {
          if (report.checkedStatus) {
            ++numberOfSolvedReports;
          }
        });
      });

      return numberOfSolvedReports;
    },
    [db]
  );

  const getUserPersonalInformation = useCallback(
    async (userId) => {
      const userPersonalInformationRef = ref(
        db,
        `usersList/${userId}/personalInformation`
      );

      let personalInformation = {};

      onValue(userPersonalInformationRef, (snapshot) => {
        const data = snapshot.val();

        // console.log(data);

        personalInformation = data;
      });

      // console.log(personalInformation);

      return personalInformation;
    },
    [db]
  );

  const history = useHistory();

  const report = props.report;

  useEffect(() => {
    // const reportsListPromise = getNumberOfSolvedReports(report.userId);
    // reportsListPromise.then((result) => {
    //   const currentLevel = parseInt(result / 5) + 1;
    //   console.log(`${report.userId}:` + currentLevel);
    // });
    // const searchedUserId = "aoJCsyLhHgYxRknu7INI1Q4ge0N2";
    // const personalInformationPromise =
    //   getUserPersonalInformation(searchedUserId);
    // personalInformationPromise.then((result) => {
    //   const birthDate = result.birthDate;
    //   console.log(`${searchedUserId}`);
    //   console.log(result);
    //   if (birthDate) {
    //     console.log("birthDate: " + birthDate.dayName);
    //   }
    // });
  }, []);

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

    const numberOfSolvedReportsPromise = getNumberOfSolvedReports(
      editedReport.userId
    );

    numberOfSolvedReportsPromise.then((result) => {
      const searchedUserId = editedReport.userId;

      const userPersonalInformationRef = ref(
        db,
        `usersList/${searchedUserId}/personalInformation`
      );

      const newUserLevel = parseInt(result / 5) + 1;

      const userPersonalInformationPromise =
        getUserPersonalInformation(searchedUserId);

      userPersonalInformationPromise.then((result) => {
        const personalInformation = result;

        if (
          personalInformation !== {} &&
          personalInformation.level !== newUserLevel
        ) {
          personalInformation.level = newUserLevel;

          set(userPersonalInformationRef, personalInformation);
        }
      });
    });

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
