// NPM
import { RootStateOrAny, useSelector } from "react-redux";

// Models
import Report from "../models/Report";
import UserPersonalInformation from "../models/UserPersonalInformation";

// Utility
import { getFormattedTaxReduction } from "../utility/custom-methods";

// Bootstrap
import { Card, Col, Container, Row } from "react-bootstrap";

// Custom CSS
import classes from "./UserProfile.module.css";

const UserProfile = () => {
  const selectedUser = useSelector((state: RootStateOrAny) => state.user.user);

  const userPersonalInformation: UserPersonalInformation =
    selectedUser.personalInformation;

  const userPersonalReports: Report[] = Object.values(
    selectedUser.personalReports
  );

  console.log(selectedUser);

  userPersonalReports.forEach((report) => {
    console.log(report);
  });

  return (
    <div className={classes["main-container"]}>
      <Card className={classes.card}>
        <Container>
          <Row>
            <Col className={classes["photo-column"]} lg={6} md={12}>
              {userPersonalInformation.photoURL ? (
                <img
                  className={classes.photo}
                  src={userPersonalInformation.photoURL}
                  alt="Not available"
                />
              ) : (
                "No photo uploaded"
              )}
            </Col>
            <Col lg={6} md={12}>
              <Row>
                <h1 className={classes["about-heading"]}>About</h1>
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
                        <b>Total reports</b>
                      </p>
                    </Col>
                    <Col>{userPersonalReports.length}</Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        <b>Tax reduction</b>
                      </p>
                    </Col>
                    <Col>
                      {getFormattedTaxReduction(userPersonalInformation)}
                    </Col>
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
