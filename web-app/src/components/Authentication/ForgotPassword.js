import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useRef, useState } from "react";
import { useHistory } from "react-router";

import { Container, Form } from "react-bootstrap";

import CustomAlert from "../CustomAlert";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import CustomText from "../CustomText";

import classes from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const auth = getAuth();

  const history = useHistory();

  const emailRef = useRef();

  const [alertIsVisible, setAlertIsVisible] = useState(false);

  const [message, setMessage] = useState("");

  const [isSuccessful, setIsSuccessful] = useState(false);

  const emailIsValid = (email) => {
    const expression =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return expression.test(String(email).trim().toLowerCase());
  };

  const redirectToLoginPageHandler = () => {
    history.push("/login");
  };

  const resetPasswordHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailRef.current.value;

    if (emailIsValid(enteredEmail)) {
      sendPasswordResetEmail(auth, enteredEmail)
        .then(() => {
          if (!isSuccessful) {
            setIsSuccessful((previousValue) => !previousValue);
          }

          setMessage("Email sent");
        })
        .catch((error) => {
          if (isSuccessful) {
            setIsSuccessful((previousValue) => !previousValue);
          }

          if (!alertIsVisible) {
            setAlertIsVisible((previousValue) => !previousValue);
          }

          setMessage(error.message);
        });
    } else {
      let errMsg = "";

      if (isSuccessful) {
        setIsSuccessful((previousValue) => !previousValue);
      }

      if (alertIsVisible) {
        setAlertIsVisible((previousValue) => !previousValue);
      }

      if (enteredEmail.length === 0) {
        errMsg = "Email should not be empty";
      } else {
        errMsg = "Email is not valid";
      }

      setAlertIsVisible(true);
      setMessage(errMsg);
    }
  };

  return (
    <Container className={classes.container}>
      <Form className={classes.form}>
        {alertIsVisible && (
          <CustomAlert
            message={message}
            onClose={() => {
              if (alertIsVisible) {
                setAlertIsVisible((previousValue) => !previousValue);
              }
            }}
            variant={isSuccessful ? "primary" : "danger"}
          />
        )}
        <CustomInput
          id="email"
          placeholder="Email"
          reference={emailRef}
          type="email"
        />
        <CustomButton onClick={resetPasswordHandler} text="Reset password" />
        <CustomText onClick={redirectToLoginPageHandler} text="Log in here" />
      </Form>
    </Container>
  );
};

export default ForgotPassword;
