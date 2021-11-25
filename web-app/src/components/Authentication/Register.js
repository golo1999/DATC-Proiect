import React, { useRef } from "react";
import { useHistory } from "react-router";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
} from "firebase/auth";

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

  const emailIsValid = (email) => {
    const expression =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return expression.test(String(email).trim().toLowerCase());
  };

  const passwordIsValid = (password) => {
    return password.length >= 8;
  };

  const nameIsValid = (name) => {
    const expression = /^[a-zA-Z]+$/;

    if (String(name).trim().length < 2) {
      return false;
    }

    return expression.test(String(name).trim());
  };

  const registrationIsValid = (email, password, firstName, lastName) => {
    console.log(emailIsValid(email));
    console.log(passwordIsValid(password));
    console.log(nameIsValid(firstName));
    console.log(nameIsValid(lastName));

    // console.log(
    //   emailIsValid(email) &&
    //     passwordIsValid(password) &&
    //     nameIsValid(firstName) &&
    //     nameIsValid(lastName)
    // );

    return (
      emailIsValid(email) &&
      passwordIsValid(password) &&
      nameIsValid(firstName) &&
      nameIsValid(lastName)
    );
  };

  const redirectToLoginPageHandler = () => {
    history.push("/login");
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
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;

          console.log(user.email);

          history.push("/login");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          console.log(errorCode + " " + errorMessage);
        });
    }
  };

  return (
    <form className={classes.form}>
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
    </form>
  );
};

export default Register;
