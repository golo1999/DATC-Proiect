import React from "react";
import { useSelector } from "react-redux";

import { Card, Col, Container, Row } from "react-bootstrap";

import classes from "./UserProfile.module.css";

const UserProfile = (props) => {
  const selectedUser = useSelector((state) => state.user.user);

  const userPersonalInformation = selectedUser.personalInformation;

  const userPersonalReports = Object.values(selectedUser.personalReports);

  console.log(selectedUser);

  // console.log(userPersonalReports);

  userPersonalReports.forEach((report) => {
    console.log(report);
  });

  /*

  email
  firstName
  lastName
  level
  phoneNumber
  totalReports

  */

  return (
    <div className={classes["main-container"]}>
      <Card className={classes.card}>
        {" "}
        <Container>
          <Row>
            <Col className={classes["photo-column"]} lg={6} md={12}>
              {userPersonalInformation.photoURL
                ? userPersonalInformation.photoURL
                : "No photo uploaded"}
            </Col>
            <Col lg={6} md={12}>
              <Row>
                <h1 className={classes["about-heading"]}>About</h1>
              </Row>
              <Row>
                <p>
                  {userPersonalInformation.description
                    ? userPersonalInformation.description
                    : "No description found"}
                </p>
              </Row>
              <Row>
                <Col lg={6} md={12}>
                  <Row>
                    <Col>
                      <p>
                        <b>Email</b>
                      </p>
                    </Col>
                    <Col>{userPersonalInformation.email}</Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        <b>First name</b>
                      </p>
                    </Col>
                    <Col>{userPersonalInformation.firstName}</Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        <b>Last name</b>
                      </p>
                    </Col>
                    <Col>{userPersonalInformation.lastName}</Col>
                  </Row>
                </Col>
                <Col lg={6} md={12}>
                  <Row>
                    <Col>
                      <p>
                        <b>Level</b>
                      </p>
                    </Col>
                    <Col>{userPersonalInformation.level}</Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        <b>Phone</b>
                      </p>
                    </Col>
                    <Col>
                      {userPersonalInformation.phoneNumber
                        ? userPersonalInformation.phoneNumber
                        : "Unknown"}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        <b>Total reports</b>
                      </p>
                    </Col>
                    <Col>{userPersonalReports.length}</Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </Card>
    </div>
  );
};

export default UserProfile;
