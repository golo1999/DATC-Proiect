// NPM
import { set } from "firebase/database";
import React, { MutableRefObject, useRef, useState } from "react";
import { useHistory } from "react-router";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";

// Models
import AdminPersonalInformation from "../../models/AdminPersonalInformation";

// Utility
import {
  emailIsValid,
  nameIsValid,
  passwordIsValid,
  registrationIsValid,
} from "../../utility/custom-methods";
import { db } from "../../utility/firebase";

// Bootstrap
import { Container, Form } from "react-bootstrap";

// Custom components
import CustomAlert from "../CustomAlert";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import CustomText from "../CustomText";

// Custom CSS
import classes from "./Register.module.css";

const Register = () => {
  const history = useHistory();

  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;

  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;

  const firstNameRef = useRef() as MutableRefObject<HTMLInputElement>;

  const lastNameRef = useRef() as MutableRefObject<HTMLInputElement>;

  const [errorIsVisible, setErrorIsVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const createPersonalInformationPath = (
    personalInformation: AdminPersonalInformation
  ) => {
    if (personalInformation) {
      const adminsListRef = db.ref(
        `adminsList/${personalInformation.id}/personalInformation`
      );

      set(adminsListRef, personalInformation);
    }
  };

  const redirectToLoginPageHandler = () => {
    history.push("/login");
  };

  const registerHandler = (event: React.MouseEvent) => {
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

                const personalInformation: AdminPersonalInformation =
                  new AdminPersonalInformation(
                    enteredEmail,
                    enteredFirstName,
                    admin.uid,
                    enteredLastName
                  );

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
          <CustomAlert
            message={errorMessage}
            onClose={() => {
              if (errorIsVisible) {
                setErrorIsVisible((previousValue) => !previousValue);
              }
            }}
            variant="danger"
          />
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
