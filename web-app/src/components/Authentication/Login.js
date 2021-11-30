import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { Alert } from "react-bootstrap";

import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import CustomText from "../CustomText";

import classes from "./Login.module.css";
import { authActions } from "../../store/auth-slice";

const Login = () => {
  const auth = getAuth();

  const dispatch = useDispatch();

  const history = useHistory();

  const emailRef = useRef();

  const passwordRef = useRef();

  const [errorIsVisible, setErrorIsVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const emailIsValid = (email) => {
    const expression =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return expression.test(String(email).trim().toLowerCase());
  };

  const passwordIsValid = (password) => {
    return password.length >= 8;
  };

  const loginIsValid = (email, password) => {
    return emailIsValid(email) && passwordIsValid(password);
  };

  const loginHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailRef.current.value;

    const enteredPassword = passwordRef.current.value;

    if (loginIsValid(enteredEmail, enteredPassword)) {
      signInWithEmailAndPassword(auth, enteredEmail, enteredPassword)
        .then((userCredential) => {
          const admin = userCredential.user;

          if (admin.emailVerified) {
            dispatch(
              authActions.authenticateAdmin({
                authenticatedAdmin: {
                  email: admin.email,
                  firstName: "Alex",
                  lastName: "Gologan",
                  uid: admin.uid,
                },
              })
            );

            history.push("/");
          } else {
            setErrorIsVisible(true);
            setErrorMessage("Please verify your email");
          }
        })
        .catch(() => {
          setErrorIsVisible(true);
          setErrorMessage("Incorrect username or password");
        });
    } else {
      let errMsg = "";

      if (enteredEmail.length === 0 && enteredPassword.length === 0) {
        errMsg = "Email and password should not be empty";
      } else if (enteredEmail.length === 0) {
        errMsg = "Email should not be empty";
      } else if (enteredPassword.length === 0) {
        errMsg = "Password should not be empty";
      } else if (
        !emailIsValid(enteredEmail) &&
        !passwordIsValid(enteredPassword)
      ) {
        errMsg = "Email and password are not valid";
      } else if (!emailIsValid(enteredEmail)) {
        errMsg = "Email is not valid";
      } else if (!passwordIsValid(enteredPassword)) {
        errMsg = "Password should have at least 8 characters";
      }

      setErrorIsVisible(true);
      setErrorMessage(errMsg);
    }
  };

  const redirectToRegisterPageHandler = () => {
    history.push("/register");
  };

  return (
    <form className={classes.form}>
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
      <CustomInput id="check" type="checkbox" />
      <CustomButton onClick={loginHandler} text="Log in" />
      <CustomText
        onClick={redirectToRegisterPageHandler}
        text="Register here"
      />
    </form>
  );
};

export default Login;
