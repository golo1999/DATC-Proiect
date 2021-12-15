import { set } from "firebase/database";
import React, { useRef, useState } from "react";
import { useHistory } from "react-router";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { db } from "../../Firebase";

import { Alert, Container, Form } from "react-bootstrap";

import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import CustomText from "../CustomText";

import classes from "./Register.module.css";

const Register = () => {
  const history = useHistory();

  const emailRef = useRef();

  const passwordRef = useRef();

  const firstNameRef = useRef();

  const lastNameRef = useRef();

  const [errorIsVisible, setErrorIsVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const createPersonalInformationPath = (personalInformation) => {
    if (personalInformation != null) {
      const adminsListRef = db.ref(
        "adminsList/" + personalInformation.id + "/personalInformation"
      );

      set(adminsListRef, personalInformation);
    }
  };

  const emailIsValid = (email) => {
    const expression =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return expression.test(String(email).trim().toLowerCase());
  };

  const nameIsValid = (name) => {
    const expression = /^[a-zA-Z]+$/;

    if (String(name).trim().length < 2) {
      return false;
    }

    return expression.test(String(name).trim());
  };

  const passwordIsValid = (password) => {
    return password.length >= 8;
  };

  const redirectToLoginPageHandler = () => {
    history.push("/login");
  };

  const registrationIsValid = (email, password, firstName, lastName) => {
    return (
      emailIsValid(email) &&
      passwordIsValid(password) &&
      nameIsValid(firstName) &&
      nameIsValid(lastName)
    );
  };

  const registerHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;
    const enteredFirstName = firstNameRef.current.value;
    const enteredLastName = lastNameRef.current.value;

    if (
      registrationIsValid(
        enteredEmail,
        enteredPassword,
        enteredFirstName,
        enteredLastName
      )
    ) {
      const auth = getAuth();

      createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword)
        .then((adminCredential) => {
          // Signed up
          const admin = adminCredential.user;

          if (admin != null) {
            sendEmailVerification(admin)
              .then(() => {
                // Email sent
                console.log("Email verification sent");

                const personalInformation = {
                  admin: true,
                  email: enteredEmail,
                  firstName: enteredFirstName,
                  id: admin.uid,
                  lastName: enteredLastName,
                };

                createPersonalInformationPath(personalInformation);

                signOut(auth)
                  .then(() => {
                    history.push("/login");
                  })
                  .catch(() => {
                    setErrorIsVisible(true);
                    setErrorMessage("Sign out failed");
                  });
              })
              .catch(() => {
                setErrorIsVisible(true);
                setErrorMessage("Sending email verification failed");
              });
          }
        })
        .catch(() => {
          setErrorIsVisible(true);
          setErrorMessage("Registration failed");
        });
    } else {
      let errMsg = "";

      if (
        enteredEmail.length === 0 ||
        enteredPassword.length === 0 ||
        enteredFirstName.length === 0 ||
        enteredLastName.length === 0
      ) {
        errMsg = "Please complete all the inputs";
      } else if (
        !emailIsValid(enteredEmail) &&
        !passwordIsValid(enteredPassword) &&
        !nameIsValid(enteredFirstName) &&
        !nameIsValid(enteredLastName)
      ) {
        errMsg = "No input is valid";
      } else if (!emailIsValid(enteredEmail)) {
        errMsg = "Email is not valid";
      } else if (!passwordIsValid(enteredPassword)) {
        errMsg = "Password should have at least 8 characters";
      } else if (!nameIsValid(enteredFirstName)) {
        errMsg = "First name is not valid";
      } else if (!nameIsValid(enteredLastName)) {
        errMsg = "Last name is not valid";
      }

      setErrorIsVisible(true);
      setErrorMessage(errMsg);
    }
  };

  return (
    <Container className={classes.container}>
      <Form className={classes.form}>
        {errorIsVisible && (
          <Alert
            variant="danger"
            onClose={() => setErrorIsVisible(false)}
            dismissible
          >
            <Alert.Heading>{errorMessage}</Alert.Heading>
          </Alert>
        )}
        <CustomInput
          id="email"
          placeholder="Email"
          reference={emailRef}
          type="email"
        />
        <CustomInput
          id="psw"
          placeholder="Password"
          reference={passwordRef}
          type="password"
        />
        <CustomInput
          id="fname"
          placeholder="First name"
          reference={firstNameRef}
          type="text"
        />
        <CustomInput
          id="lname"
          placeholder="Last name"
          reference={lastNameRef}
          type="text"
        />
        <CustomButton onClick={registerHandler} text="Register" />
        <CustomText onClick={redirectToLoginPageHandler} text="Log in here" />
      </Form>
    </Container>
  );
};

export default Register;
