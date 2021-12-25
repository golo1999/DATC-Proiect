// Bootstrap
import { MouseEventHandler } from "react";
import { Alert, Col, Row } from "react-bootstrap";

// Custom CSS
import classes from "./CustomAlert.module.css";

type Props = { message: string; onClose: MouseEventHandler; variant: string };

const CustomAlert = ({ message, onClose, variant }: Props) => {
  return (
    <Row className={classes["alert-container"]}>
      <Col xl={6} lg={6} md={9} sm={9} xs={9}>
        <Alert variant={variant} onClose={onClose} dismissible>
          <Alert.Heading className={classes["message-container"]}>
            {message}
          </Alert.Heading>
        </Alert>
      </Col>
    </Row>
  );
};

export default CustomAlert;
