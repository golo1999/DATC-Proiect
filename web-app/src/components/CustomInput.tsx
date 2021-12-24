// NPM
import { MutableRefObject } from "react";

// Bootstrap
import { Col, Form, Row } from "react-bootstrap";

// Custom CSS
import classes from "./CustomInput.module.css";

type Props = {
  id: string;
  label?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  reference?: MutableRefObject<HTMLInputElement>;
  type: string;
};

const CustomInput = ({
  id,
  label,
  onChange,
  placeholder,
  reference,
  type,
}: Props) => {
  return (
    <Row className={classes["input-container"]}>
      <Col xl={6} lg={6} md={9} sm={9} xs={9}>
        {type !== "checkbox" && (
          <Form.Control
            autoComplete="off"
            className={classes.input}
            id={id}
            placeholder={placeholder}
            ref={reference}
            type={type}
          />
        )}
        {type === "checkbox" && (
          <Form.Check
            className={classes.checkbox}
            id={id}
            label={label}
            onChange={onChange}
            type={type}
          />
        )}
      </Col>
    </Row>
  );
};

export default CustomInput;
