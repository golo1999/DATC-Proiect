import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { userActions } from "../store/user-slice";

import { Card, Col, Container, Row } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";

import classes from "./UserItem.module.css";

const UserItem = (props) => {
  const dispatch = useDispatch();

  const history = useHistory();

  const user = props.user;

  const userPersonalInformation = user.personalInformation;

  const checkUserDetailsHandler = () => {
    dispatch(userActions.setSelectedUser({ selectedUser: user }));

    history.push("/users/" + userPersonalInformation.id);
  };

  return (
    <li>
      <Card className={classes.card}>
        <Card.Body className={classes["card-body"]}>
          <Container>
            {/* XL, LG, MD LAYOUT */}
            <Row className="d-none d-md-flex">
              <Col className={classes["user-name-container"]}>
                {`${userPersonalInformation.firstName} ${userPersonalInformation.lastName}`}
              </Col>
              <Col className={classes["user-level-container"]}>
                {`Level ` + userPersonalInformation.level}
              </Col>
              <Col className={classes["icons-container"]}>
                <FaAngleRight
                  className={classes["user-details-icon"]}
                  onClick={checkUserDetailsHandler}
                />
              </Col>
            </Row>
            {/* SM, XS LAYOUT */}
            <Row className="d-flex d-sm-flex d-md-none">
              <Col>
                <Row>
                  <Col className={classes["user-name-container"]}>
                    {`${userPersonalInformation.firstName} ${userPersonalInformation.lastName}`}
                  </Col>
                </Row>
                <Row>
                  <Col
                    className={classes["user-level-container-second-layout"]}
                  >
                    {`Level ` + userPersonalInformation.level}
                  </Col>
                </Row>
              </Col>
              <Col className={classes["icons-container"]}>
                <FaAngleRight
                  className={classes["user-details-icon"]}
                  onClick={checkUserDetailsHandler}
                />
              </Col>
            </Row>
          </Container>
          {/* <div className={classes["user-name-container"]}>
            {userPersonalInformation.firstName}
          </div> */}
          {/* <div className={classes["user-level-container"]}>
            {`Level ` + userPersonalInformation.level}
          </div> */}
          {/* <div className={classes["icons-container"]}>
            <FaAngleRight
              className={classes["user-details-icon"]}
              onClick={checkUserDetailsHandler}
            />
          </div> */}
        </Card.Body>
      </Card>
    </li>
  );
};

export default UserItem;
