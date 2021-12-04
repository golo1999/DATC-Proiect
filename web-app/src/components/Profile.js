import {
  getAuth,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

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

import { authActions } from "../store/auth-slice";

import classes from "./Profile.module.css";

const Profile = (props) => {
  const auth = getAuth();

  const db = getDatabase();

  const dispatch = useDispatch();

  const history = useHistory();

  const newEmailAddressRef = useRef();

  const oldPasswordRef = useRef();

  const passwordRef = useRef();

  const passwordConfirmationRef = useRef();

  const firstNameRef = useRef();

  const lastNameRef = useRef();

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

  const [successIsVisible, setSuccessIsVisible] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [failIsVisible, setFailIsVisible] = useState(false);

  const [failMessage, setFailMessage] = useState("");

  const adminPersonalInformation = useSelector((state) => state.auth.admin);

  const adminPersonalInformationRef = ref(
    db,
    "adminsList/" + currentAdmin.uid + "/personalInformation"
  );

  const emailIsValid = (email) => {
    const expression =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return expression.test(String(email).trim().toLowerCase());
  };

  const closeModalHandler = () => {
    if (modalIsVisible && modalMessage !== "") {
      setModalIsVisible(false);
      setModalMessage("");
    }
  };

  const closeConfirmationModalHandler = () => {
    if (errorIsVisible && errorMessage !== "") {
      setErrorIsVisible(false);
      setErrorMessage("");
    }

    if (confirmationModalIsVisible && confirmationModalMessage !== "") {
      setConfirmationModalIsVisible(false);
      setConfirmationModalMessage("");
    }
  };

  const closeAlertHandler = () => {
    if (successIsVisible && successMessage !== "") {
      setSuccessIsVisible(false);
      setSuccessMessage("");
    }

    if (failIsVisible && failMessage !== "") {
      setFailIsVisible(false);
      setFailMessage("");
    }
  };

  const resetErrorHandler = () => {
    if (errorIsVisible && errorMessage !== "") {
      setErrorIsVisible(false);
      setErrorMessage("");
    }
  };

  const setFail = (message) => {
    closeAlertHandler();

    setFailIsVisible(true);
    setFailMessage(message);
  };

  const setSuccess = (message) => {
    closeAlertHandler();

    setSuccessIsVisible(true);
    setSuccessMessage(message);
  };

  const confirmationHandler = () => {
    if (confirmationModalAction === 0) {
      const enteredEmail = newEmailAddressRef.current.value;

      const enteredPassword = passwordRef.current.value;

      resetErrorHandler();

      if (emailIsValid(enteredEmail) && enteredPassword.length >= 8) {
        const credential = EmailAuthProvider.credential(
          adminPersonalInformation.email,
          enteredPassword
        );

        reauthenticateWithCredential(currentAdmin, credential)
          .then(() => {
            // User re-authenticated
            updateEmail(currentAdmin, enteredEmail)
              .then(() => {
                // Email updated!
                const updatedAdmin = {
                  admin: true,
                  email: enteredEmail,
                  firstName: adminPersonalInformation.firstName,
                  id: adminPersonalInformation.id,
                  lastName: adminPersonalInformation.lastName,
                };

                set(adminPersonalInformationRef, updatedAdmin)
                  .then(() => {
                    dispatch(
                      authActions.authenticateAdmin({
                        authenticatedAdmin: {
                          email: updatedAdmin.email,
                          firstName: updatedAdmin.firstName,
                          id: updatedAdmin.id,
                          lastName: updatedAdmin.lastName,
                        },
                      })
                    );

                    setSuccess("The email has been updated");
                    closeConfirmationModalHandler();
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              })
              .catch((error) => {
                // An error occurred
                console.log(error.message);
              });
          })
          .catch((error) => {
            console.log(error.message);
          });
      } else if (!emailIsValid(enteredEmail) && enteredPassword.length < 8) {
        setErrorMessage(
          "The email is not valid & the password should have at least 8 characters!"
        );
        setErrorIsVisible(true);
      } else if (!emailIsValid(enteredEmail)) {
        setErrorIsVisible(true);
        setErrorMessage("The email is not valid!");
      } else {
        setErrorIsVisible(true);
        setErrorMessage("The password should have at least 8 characters!");
      }
    } else if (confirmationModalAction === 1) {
      const oldPassword = oldPasswordRef.current.value;

      const enteredPassword = passwordRef.current.value;

      const confirmedPassword = passwordConfirmationRef.current.value;

      resetErrorHandler();

      if (
        enteredPassword === confirmedPassword &&
        oldPassword.length >= 8 &&
        enteredPassword.length >= 8 &&
        confirmedPassword.length >= 8
      ) {
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
                setSuccess("The password has been updated");
                closeConfirmationModalHandler();
              })
              .catch((error) => {
                // An error ocurred
                setErrorIsVisible(true);
                setErrorMessage("Updating password failed");

                console.log(error.message);
              });
          })
          .catch((error) => {
            // An error ocurred
            setErrorIsVisible(true);
            setErrorMessage(
              "Invalid password/your account does not have a password."
            );
            console.log(error.message);
          });
      } else if (
        oldPassword.length < 8 ||
        enteredPassword.length < 8 ||
        confirmedPassword.length < 8
      ) {
        setErrorIsVisible(true);
        setErrorMessage("The passwords should have at least 8 characters!");
      } else {
        setErrorIsVisible(true);
        setErrorMessage("The new passwords don't match!");
      }
    } else if (confirmationModalAction === 2) {
      const enteredPassword = passwordRef.current.value;

      resetErrorHandler();

      if (enteredPassword.length >= 8) {
        const credential = EmailAuthProvider.credential(
          adminPersonalInformation.email,
          enteredPassword
        );

        reauthenticateWithCredential(currentAdmin, credential)
          .then(() => {
            // User re-authenticated
            deleteUser(currentAdmin)
              .then(() => {
                // User deleted
                dispatch(authActions.signOutAdmin());

                history.push("/logout");
              })
              .catch((error) => {
                // An error ocurred
                console.log(error.message);
              });
          })
          .catch((error) => {
            // An error ocurred
            console.log(error.message);
          });
      } else {
        setErrorIsVisible(true);
        setErrorMessage("The password should have at least 8 characters!");
      }
    }
  };

  const openModalHandler = (event) => {
    event.preventDefault();

    const clickedButtonId = event.target.id;

    if (clickedButtonId === "changeEmailButton") {
      if (modalAction !== 0) {
        setModalAction(0);
      }

      setModalIsVisible(true);
      setModalMessage("Are you sure you want to change your email address?");
    } else if (clickedButtonId === "changePasswordButton") {
      if (modalAction !== 1) {
        setModalAction(1);
      }

      setModalIsVisible(true);
      setModalMessage("Are you sure you want to change your password?");
    } else if (clickedButtonId === "deleteAccountButton") {
      if (modalAction !== 2) {
        setModalAction(2);
      }

      setModalIsVisible(true);
      setModalMessage("Are you sure you want to delete your account?");
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

  const changeNamesHandler = (event) => {
    event.preventDefault();

    const enteredFirstName = firstNameRef.current.value.trim();

    const enteredLastName = lastNameRef.current.value.trim();

    closeAlertHandler();

    if (
      enteredFirstName.length !== 0 &&
      enteredLastName.length !== 0 &&
      (enteredFirstName !== adminPersonalInformation.firstName ||
        enteredLastName !== adminPersonalInformation.lastName)
    ) {
      const updatedAdminPersonalInformation = {
        admin: true,
        email: adminPersonalInformation.email,
        firstName: enteredFirstName,
        id: adminPersonalInformation.id,
        lastName: enteredLastName,
      };

      set(adminPersonalInformationRef, updatedAdminPersonalInformation)
        .then(() => {
          dispatch(
            authActions.authenticateAdmin({
              authenticatedAdmin: {
                email: updatedAdminPersonalInformation.email,
                firstName: enteredFirstName,
                id: updatedAdminPersonalInformation.id,
                lastName: enteredLastName,
              },
            })
          );

          setSuccess("First and last name updated");
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else if (enteredFirstName.length === 0 || enteredLastName.length === 0) {
      setFail("The names should not be empty");
    } else if (
      enteredFirstName === adminPersonalInformation.firstName &&
      enteredLastName === adminPersonalInformation.lastName
    ) {
      setFail("The names are the same");
    } else {
      setFail("Changing names failed");
    }
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
              <Form.Group className="mb-3" controlId="formBasicNewEmail">
                <Form.Label>New email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  ref={newEmailAddressRef}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Label></Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  ref={passwordRef}
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
                <Form.Control
                  type="password"
                  placeholder="Password"
                  ref={passwordRef}
                />
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
                    ref={firstNameRef}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicLastName">
                  <Form.Label className={classes["input-label"]}>
                    Last name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={adminPersonalInformation.lastName}
                    ref={lastNameRef}
                  />
                </Form.Group>

                {(successIsVisible || failIsVisible) && (
                  <Alert
                    variant={successIsVisible ? "success" : "danger"}
                    onClose={closeAlertHandler}
                    dismissible
                  >
                    <Alert.Heading>
                      {successIsVisible ? successMessage : failMessage}
                    </Alert.Heading>
                  </Alert>
                )}

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
                    onClick={changeNamesHandler}
                    variant="success"
                    type="submit"
                  >
                    Change names
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
