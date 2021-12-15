import { Col, Form, Row } from "react-bootstrap";

import classes from "./CustomInput.module.css";

const CustomInput = (props) => {
  return (
    <Row className={classes["input-container"]}>
      <Col xl={6} lg={6} md={9} sm={9} xs={9}>
        {props.type !== "checkbox" && (
          <Form.Control
            autoComplete="off"
            className={classes.input}
            id={props.id}
            placeholder={props.placeholder}
            ref={props.reference}
            type={props.type}
          />
        )}
        {props.type === "checkbox" && (
          <Form.Check
            className={classes.checkbox}
            id={props.id}
            label={props.label}
            type={props.type}
          />
        )}
      </Col>
      {/* <input
        autoComplete="off"
        className={classes.input}
        id={props.id}
        placeholder={props.placeholder}
        ref={props.reference}
        type={props.type}
      />
      {props.type === "checkbox" && <label htmlFor="check">Remember me</label>} */}
    </Row>
  );
};

export default CustomInput;

/*

<Row>
        <Col xl={6} lg={6} md={9} sm={9} xs={9}>
          <Form.Control
            className={classes.email}
            type="email"
            placeholder="Email"
          />
        </Col>
      </Row>

*/
