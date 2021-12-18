import React from "react";

import { Button, Col, Container, Modal, Row } from "react-bootstrap";

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
                <i>
                  {selectedReport.category === 0
                    ? "Danger"
                    : selectedReport.category === 1
                    ? "Garbage"
                    : selectedReport.category === 2
                    ? "Pothole"
                    : "Vandalism"}
                </i>
              </Row>
              <Row>
                <i>{selectedReport.checkStatus ? "Yes" : "No"}</i>
              </Row>
              <Row>
                <i>{selectedReportDateTime}</i>
              </Row>
              <Row>
                <i>
                  {selectedUserDetails.firstName && selectedUserDetails.lastName
                    ? selectedUserDetails.firstName +
                      " " +
                      selectedUserDetails.lastName
                    : "Unknown"}
                </i>
              </Row>
              <Row>
                <i>
                  {selectedReportLocation
                    ? selectedReportLocation.city +
                      " | " +
                      selectedReportLocation.regionName +
                      " | " +
                      selectedReportLocation.country
                    : "Unknown"}
                </i>
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
