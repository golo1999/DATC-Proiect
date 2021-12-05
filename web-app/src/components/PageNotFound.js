import React from "react";

import { Button, Col, Container, Row } from "react-bootstrap";

import classes from "./PageNotFound.module.css";

const PageNotFound = (props) => {
  return (
    <div>
      <Container>
        <Row className={classes["error-code-container"]}>
          <h1>404</h1>
        </Row>
        <Row className={classes["error-message-container"]}>
          <h2>Oops! Page not found</h2>
        </Row>
        <Row className={classes["error-description-container"]}>
          <h5>Sorry, the page you're looking for doesn't exist.</h5>
        </Row>
        <Row>
          <Button>Go back</Button>
        </Row>
      </Container>
    </div>
  );
};

export default PageNotFound;
