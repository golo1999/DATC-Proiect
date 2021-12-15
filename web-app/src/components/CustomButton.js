import { Button, Col, Row } from "react-bootstrap";

import classes from "./CustomButton.module.css";

const CustomButton = (props) => {
  return (
    <Row className={classes["button-container"]}>
      <Col xl={6} lg={6} md={9} sm={9} xs={9}>
        <Button className={classes.button} onClick={props.onClick}>
          {props.text}
        </Button>
      </Col>
    </Row>
  );
};

export default CustomButton;
