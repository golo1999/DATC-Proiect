// NPM
import React from "react";

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

const CustomModal = (props) => {
  const selectedReport = props.selectedReport;

  const selectedReportLocation = props.selectedReportLocation;

  const selectedReportDateTime = props.selectedReportDateTime;

  const selectedUserDetails = props.selectedUserDetails;

  return (
    <Modal
      show={props.visible}
      onHide={props.closeHandler}
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
        <Button className={classes.button} onClick={props.closeHandler}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
