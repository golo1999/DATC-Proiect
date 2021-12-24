// NPM
import { MouseEventHandler } from "react";

// Bootstrap
import { Button, Col, Row } from "react-bootstrap";

// Custom CSS
import classes from "./CustomButton.module.css";

type Props = { onClick: MouseEventHandler; text: string };

const CustomButton = ({ onClick, text }: Props) => {
  return (
    <Row className={classes["button-container"]}>
      <Col xl={6} lg={6} md={9} sm={9} xs={9}>
        <Button className={classes.button} onClick={onClick}>
          {text}
        </Button>
      </Col>
    </Row>
  );
};

export default CustomButton;
