import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";

import classes from "./Profile.module.css";

const Profile = (props) => {
  const auth = getAuth();

  const newEmailAddressRef = useRef();

  const oldPasswordRef = useRef();

  const passwordRef = useRef();

  const passwordConfirmationRef = useRef();

  const currentAdmin = auth.currentUser;

  const [modalAction, setModalAction] = useState(-1);

  const [confirmationModalAction, setConfirmationModalAction] = useState(-1);

  const [modalIsVisible, setModalIsVisible] = useState(false);

  const [confirmationModalIsVisible, setConfirmationModalIsVisible] =
    useState(false);

  const [modalMessage, setModalMessage] = useState("");

  const [confirmationModalMessage, setConfirmationModalMessage] = useState("");

  const [errorIsVisible, setErrorIsVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const adminPersonalInformation = useSelector((state) => state.auth.admin);

  const closeModalHandler = () => {
    setModalMessage("");
    setModalIsVisible(false);
  };

  const closeConfirmationModalHandler = () => {
    setErrorIsVisible(false);
    setErrorMessage("");

    setConfirmationModalMessage("");
    setConfirmationModalIsVisible(false);
  };

  const confirmationHandler = () => {
    if (confirmationModalAction === 0) {
      console.log("email confirmed: " + newEmailAddressRef.current.value);
    } else if (confirmationModalAction === 1) {
      const oldPassword = oldPasswordRef.current.value;

      const enteredPassword = passwordRef.current.value;

      const confirmedPassword = passwordConfirmationRef.current.value;

      if (
        enteredPassword === confirmedPassword &&
        enteredPassword.length >= 8 &&
        confirmedPassword.length >= 8
      ) {
        if (errorIsVisible && errorMessage !== "") {
          setErrorMessage("");
          setErrorIsVisible(false);
        }

        const credential = EmailAuthProvider.credential(
          adminPersonalInformation.email,
          oldPassword
        );

        reauthenticateWithCredential(currentAdmin, credential)
          .then(() => {
            // User re-authenticated
            updatePassword(currentAdmin, enteredPassword)
              .then(() => {
                // Update successful
                alert("Password changed");
                closeConfirmationModalHandler();
              })
              .catch((error) => {
                // An error ocurred
                if (!errorIsVisible && errorMessage === "") {
                  setErrorMessage("Updating password failed");
                  setErrorIsVisible(true);
                }

                console.log(error.message);
              });
          })
          .catch((error) => {
            // An error ocurred
            console.log(error.message);
          });
      } else if (enteredPassword.length < 8 || confirmedPassword.length < 8) {
        setErrorMessage("Password is too short!");
        setErrorIsVisible(true);
      } else {
        setErrorMessage("Passwords don't match!");
        setErrorIsVisible(true);
      }
    } else if (confirmationModalAction === 2) {
      console.log("delete confirmed");
    }
  };

  const openModalHandler = (event) => {
    event.preventDefault();

    const clickedButtonId = event.target.id;

    if (clickedButtonId === "changeEmailButton") {
      if (modalAction !== 0) {
        setModalAction(0);
      }

      setModalMessage("Are you sure you want to change your email address?");
      setModalIsVisible(true);
    } else if (clickedButtonId === "changePasswordButton") {
      if (modalAction !== 1) {
        setModalAction(1);
      }

      setModalMessage("Are you sure you want to change your password?");
      setModalIsVisible(true);
    } else if (clickedButtonId === "deleteAccountButton") {
      if (modalAction !== 2) {
        setModalAction(2);
      }

      setModalMessage("Are you sure you want to delete your account?");
      setModalIsVisible(true);
    }
  };

  const openConfirmationModalHandler = () => {
    setConfirmationModalMessage(
      modalAction === 0
        ? "Please enter your new email address"
        : modalAction === 1
        ? "Please enter your new password"
        : "Please enter your password"
    );
    setConfirmationModalIsVisible(true);
  };

  const changeEmailHandler = () => {
    closeModalHandler();

    if (confirmationModalAction !== 0) {
      setConfirmationModalAction(0);
    }

    openConfirmationModalHandler();

    // updateEmail(currentAdmin);
  };

  const changePasswordHandler = () => {
    closeModalHandler();

    if (confirmationModalAction !== 1) {
      setConfirmationModalAction(1);
    }

    openConfirmationModalHandler();
  };

  const deleteAccountHandler = () => {
    closeModalHandler();

    if (confirmationModalAction !== 2) {
      setConfirmationModalAction(2);
    }

    openConfirmationModalHandler();
  };

  const saveFirstAndLastNameHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Modal
        className={classes.modal}
        show={modalIsVisible}
        onHide={closeModalHandler}
      >
        <Modal.Header className={classes["modal-header"]} closeButton>
          <Modal.Title>{modalMessage}</Modal.Title>
        </Modal.Header>
        <Modal.Footer className={classes["modal-footer"]}>
          <Button variant="secondary" onClick={closeModalHandler}>
            No
          </Button>
          <Button
            variant="dark"
            onClick={
              modalAction === 0
                ? changeEmailHandler
                : modalAction === 1
                ? changePasswordHandler
                : deleteAccountHandler
            }
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        className={classes.modal}
        show={confirmationModalIsVisible}
        onHide={closeConfirmationModalHandler}
      >
        <Modal.Header className={classes["modal-header"]} closeButton>
          <Modal.Title>{confirmationModalMessage}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmationModalAction === 0 && (
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>New email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  ref={newEmailAddressRef}
                />
              </Form.Group>
            </Form>
          )}
          {confirmationModalAction === 1 && (
            <Form>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Old password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Old password"
                  ref={oldPasswordRef}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicNewPassword">
                <Form.Label>New password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="New password"
                  ref={passwordRef}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="formBasicConfirmNewPassword"
              >
                <Form.Label>Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="New password"
                  ref={passwordConfirmationRef}
                />
              </Form.Group>
            </Form>
          )}
          {confirmationModalAction === 2 && (
            <Form>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label></Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
            </Form>
          )}
          {errorIsVisible && (
            <Alert
              variant="warning"
              onClose={() => setErrorIsVisible(false)}
              dismissible
            >
              <Alert.Heading>{errorMessage}</Alert.Heading>
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer className={classes["modal-footer"]}>
          <Button variant="secondary" onClick={closeConfirmationModalHandler}>
            Close
          </Button>
          <Button onClick={confirmationHandler} variant="dark">
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <Container className={classes.container}>
        <Row className={classes["top-row"]}>
          <Col className={classes.column}>
            <Card className={classes["top-row-card"]}>
              <Card.Body>
                <Card.Title className={classes["top-row-card-title"]}>
                  Profile management
                </Card.Title>
                <Card.Text>Here you can edit your settings</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className={classes["bottom-row"]}>
          <Col className={classes.column}>
            <Card className={classes["bottom-row-card"]}>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className={classes["input-label"]}>
                    Email address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder={adminPersonalInformation.email}
                    readOnly
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicFirstName">
                  <Form.Label className={classes["input-label"]}>
                    First name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={adminPersonalInformation.firstName}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicLastName">
                  <Form.Label className={classes["input-label"]}>
                    Last name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={adminPersonalInformation.lastName}
                  />
                </Form.Group>

                <Row className={classes["button-row"]}>
                  <Button
                    id="changeEmailButton"
                    className={classes.button}
                    onClick={openModalHandler}
                    variant="primary"
                    type="submit"
                  >
                    Change email address
                  </Button>
                </Row>
                <Row className={classes["button-row"]}>
                  <Button
                    id="changePasswordButton"
                    className={classes.button}
                    onClick={openModalHandler}
                    variant="secondary"
                    type="submit"
                  >
                    Change password
                  </Button>
                </Row>
                <Row className={classes["button-row"]}>
                  <Button
                    id="deleteAccountButton"
                    className={classes.button}
                    onClick={openModalHandler}
                    variant="danger"
                    type="submit"
                  >
                    Delete account
                  </Button>
                </Row>
                <Row className={classes["button-row"]}>
                  <Button
                    className={classes.button}
                    onClick={saveFirstAndLastNameHandler}
                    variant="success"
                    type="submit"
                  >
                    Save first & last name
                  </Button>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
