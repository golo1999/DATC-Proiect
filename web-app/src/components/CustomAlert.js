import React from "react";

import { Alert, Col, Row } from "react-bootstrap";

import classes from "./CustomAlert.module.css";

const CustomAlert = (props) => {
  console.log(props);

  return (
    <Row className={classes["alert-container"]}>
      <Col xl={6} lg={6} md={9} sm={9} xs={9}>
        <Alert variant={props.variant} onClose={props.onClose} dismissible>
          <Alert.Heading className={classes["message-container"]}>
            {props.message}
          </Alert.Heading>
        </Alert>
      </Col>
    </Row>
  );
};

export default CustomAlert;
