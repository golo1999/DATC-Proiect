// NPM
import { getDatabase, ref, onValue } from "firebase/database";
import React, { useState } from "react";
import { RootStateOrAny, useSelector } from "react-redux";

// Models
import UserPersonalInformation from "../../models/UserPersonalInformation";

// Utility
import {
  getFormattedCategoryName,
  getFormattedDateTime,
  getFormattedLocation,
  getFormattedName,
} from "../../utility/custom-methods";
import { DEFAULT_USER_PERSONAL_INFORMATION } from "../../utility/custom-variables";

// Bootstrap
import { Card, Col, Container, Row } from "react-bootstrap";

// Custom components
import Map from "../Map";

// Custom CSS
import classes from "./ReportDetails.module.css";

const ReportDetails = () => {
  const selectedReport = useSelector(
    (state: RootStateOrAny) => state.report.report
  );

  const db = getDatabase();

  const { REACT_APP_GOOGLE_KEY: GOOGLE_KEY } = process.env;

  const customStyle = <div style={{ width: "100%", height: "100%" }} />;

  const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&v=3.exp&libraries=geometry,drawing,places`;

  const userPersonalInformationRef = ref(
    db,
    `/usersList/${selectedReport.userId}/personalInformation`
  );

  let retrievedPersonalInformation = DEFAULT_USER_PERSONAL_INFORMATION;

  onValue(userPersonalInformationRef, (snapshot) => {
    const personalInformation: UserPersonalInformation = snapshot.val();

    if (personalInformation) {
      retrievedPersonalInformation.firstName = personalInformation.firstName;
      retrievedPersonalInformation.lastName = personalInformation.lastName;
    }
  });

  const selectedReportDateTime = selectedReport.dateTime;

  const selectedReportLocation = selectedReport.location;

  const [mapIsVisible, setMapIsVisible] = useState(true);

  const toggleMapHandler = () => {
    setMapIsVisible((prevValue) => !prevValue);
  };

  return (
    <div className={classes["main-container"]}>
      <Card className={classes.card}>
        <Container>
          <Row>
            <Col className={classes["photo-column"]} lg={6} md={12}>
              {selectedReport.photoURL ? (
                <img src={selectedReport.photoURL} alt="report" />
              ) : (
                "No photo uploaded"
              )}
            </Col>
            <Col className={classes["details-column"]} lg={6} md={12}>
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
                      {getFormattedCategoryName(selectedReport.category)}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        <b>Solved</b>
                      </p>
                    </Col>
                    <Col>{selectedReport.checkStatus ? "Yes" : "No"}</Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        <b>Date & Time</b>
                      </p>
                    </Col>
                    <Col>{getFormattedDateTime(selectedReportDateTime)}</Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        <b>Principal</b>
                      </p>
                    </Col>
                    <Col>{getFormattedName(retrievedPersonalInformation)}</Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        <b>Location</b>
                      </p>
                    </Col>
                    <Col>{getFormattedLocation(selectedReportLocation)}</Col>
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
                    {mapIsVisible ? "Hide" : "Show"} location
                  </h5>
                </Row>
                {mapIsVisible && (
                  <Row className={classes.map}>
                    <Map
                      // for showing a marker
                      isMarkerShown
                      centerCoordinates={{
                        lat: selectedReportLocation.latitude,
                        lng: selectedReportLocation.longitude,
                      }}
                      googleMapURL={googleMapURL}
                      loadingElement={customStyle}
                      containerElement={customStyle}
                      mapElement={customStyle}
                    />
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
