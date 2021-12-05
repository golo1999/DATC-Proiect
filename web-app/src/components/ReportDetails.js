import { getDatabase, ref, onValue } from "firebase/database";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Card, Col, Container, Row } from "react-bootstrap";

import CustomMap from "./CustomMap";

import classes from "./ReportDetails.module.css";

const ReportDetails = (props) => {
  const selectedReport = useSelector((state) => state.report.report);

  const db = getDatabase();

  const userPersonalInformationRef = ref(
    db,
    "/usersList/" + selectedReport.userId + "/personalInformation"
  );

  let retrievedPersonalInformation = { firstName: null, lastName: null };

  onValue(userPersonalInformationRef, (snapshot) => {
    const personalInformation = snapshot.val();

    retrievedPersonalInformation.firstName = personalInformation.firstName;
    retrievedPersonalInformation.lastName = personalInformation.lastName;
  });

  const selectedReportDateTime = selectedReport.dateTime;

  const selectedReportLocation = selectedReport.location;

  const [mapIsVisible, setMapIsVisible] = useState(true);

  const selectedReportParsedDateTime =
    (selectedReportDateTime.day < 10
      ? "0" + selectedReportDateTime.day
      : selectedReportDateTime.day) +
    "/" +
    (selectedReportDateTime.month < 10
      ? "0" + selectedReportDateTime.month
      : selectedReportDateTime.month) +
    "/" +
    selectedReportDateTime.year +
    " " +
    (selectedReportDateTime.hour < 10
      ? "0" + selectedReportDateTime.hour
      : selectedReportDateTime.hour) +
    ":" +
    (selectedReportDateTime.minute < 10
      ? "0" + selectedReportDateTime.minute
      : selectedReportDateTime.minute) +
    ":" +
    (selectedReportDateTime.second < 10
      ? "0" + selectedReportDateTime.second
      : selectedReportDateTime.second);

  const toggleMapHandler = () => {
    setMapIsVisible((prevValue) => !prevValue);
  };

  return (
    <div className={classes["main-container"]}>
      <Card className={classes.card}>
        <Container>
          <Row>
            <Col className={classes["photo-column"]} lg={6} md={12}>
              {selectedReport.photoURL
                ? selectedReport.photoURL
                : "No photo uploaded"}
            </Col>
            <Col lg={6} md={12}>
              <Row>
                <h1 className={classes["about-heading"]}>About</h1>
              </Row>
              {selectedReport.note && (
                <Row>
                  <p>{selectedReport.note}</p>
                </Row>
              )}
              <Row>
                <Col lg={12} md={12}>
                  <Row>
                    <Col>
                      <p>
                        <b>Category</b>
                      </p>
                    </Col>
                    <Col>
                      {selectedReport.category === 0
                        ? "Danger"
                        : selectedReport.category === 1
                        ? "Garbage"
                        : selectedReport.category === 2
                        ? "Pothole"
                        : "Vandalism"}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        <b>Solved</b>
                      </p>
                    </Col>
                    <Col>{selectedReport.checkedStatus ? "Yes" : "No"}</Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        <b>Date & Time</b>
                      </p>
                    </Col>
                    <Col>{selectedReportParsedDateTime}</Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        <b>Principal</b>
                      </p>
                    </Col>
                    <Col>
                      {retrievedPersonalInformation.firstName != null &&
                      retrievedPersonalInformation.lastName != null
                        ? retrievedPersonalInformation.firstName +
                          " " +
                          retrievedPersonalInformation.lastName
                        : "Unknown"}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        <b>Location</b>
                      </p>
                    </Col>
                    <Col>
                      {selectedReportLocation
                        ? selectedReportLocation.city +
                          " | " +
                          selectedReportLocation.regionName +
                          " | " +
                          selectedReportLocation.country
                        : "Unknown"}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          {selectedReportLocation && (
            <Row>
              <Container>
                <Row>
                  <h5
                    className={classes["map-toggler"]}
                    onClick={toggleMapHandler}
                  >
                    {mapIsVisible ? "Hide map" : "Show map"}
                  </h5>
                </Row>
                {mapIsVisible && (
                  <Row className={classes.map}>
                    <CustomMap />
                  </Row>
                )}
              </Container>
            </Row>
          )}
        </Container>
      </Card>
    </div>
  );
};

export default ReportDetails;
