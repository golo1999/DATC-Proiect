// NPM
import { MouseEventHandler } from "react";

// Models
import CustomDateTime from "../models/CustomDateTime";
import Location from "../models/Location";
import Report from "../models/Report";
import UserPersonalInformation from "../models/UserPersonalInformation";

// Utility
import {
  getFormattedCategoryName,
  getFormattedLocation,
  getFormattedName,
} from "../utility/custom-methods";

// Bootstrap
import { Button, Col, Container, Modal, Row } from "react-bootstrap";

// Custom CSS
import classes from "./CustomModal.module.css";

type Props = {
  closeHandler: MouseEventHandler;
  selectedReport: Report;
  selectedReportDateTime: CustomDateTime;
  selectedReportLocation: Location;
  selectedUserDetails: UserPersonalInformation;
  visible: boolean;
};

const CustomModal = ({
  closeHandler,
  selectedReport,
  selectedReportDateTime,
  selectedReportLocation,
  selectedUserDetails,
  visible,
}: Props) => {
  return (
    <Modal
      show={visible}
      onHide={closeHandler}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header className={classes["modal-header"]} closeButton>
        <Modal.Title
          className={classes["title"]}
          id="contained-modal-title-vcenter"
        >
          {selectedReport.note ? selectedReport.note : "No note provided"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={classes["modal-body"]}>
        <Container>
          <Row>
            <Col>
              <Row>
                <b>Category</b>
              </Row>
              <Row>
                <b>Solved</b>
              </Row>
              <Row>
                <b>Date & Time</b>
              </Row>
              <Row>
                <b>Principal</b>
              </Row>
              <Row>
                <b>Location</b>
              </Row>
            </Col>
            <Col>
              <Row>
                <i>{getFormattedCategoryName(selectedReport.category)}</i>
              </Row>
              <Row>
                <i>{selectedReport.checkStatus ? "Yes" : "No"}</i>
              </Row>
              <Row>
                <i>{selectedReportDateTime}</i>
              </Row>
              <Row>
                <i>{getFormattedName(selectedUserDetails)}</i>
              </Row>
              <Row>
                <i>{getFormattedLocation(selectedReportLocation)}</i>
              </Row>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer className={classes["modal-footer"]}>
        <Button className={classes.button} onClick={closeHandler}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
