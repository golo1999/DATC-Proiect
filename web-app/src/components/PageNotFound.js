import React from "react";

import { Button, Col, Container, Row } from "react-bootstrap";

const PageNotFound = (props) => {
  return (
    <div>
      <Container>
        <Row>
          <h1>404</h1>
        </Row>
        <Row>
          <h2>Oops! Page not found</h2>
        </Row>
        <Row>
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
