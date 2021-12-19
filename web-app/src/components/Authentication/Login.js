// NPM
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

// Redux
import { authActions } from "../../store/auth-slice";

// Utility
import {
  emailIsValid,
  loginIsValid,
  passwordIsValid,
} from "../../utility/custom-methods";

// Bootstrap
import { Container, Form } from "react-bootstrap";

// Custom components
import CustomAlert from "../CustomAlert";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import CustomText from "../CustomText";

// Custom CSS
import classes from "./Login.module.css";

const Login = () => {
  const auth = getAuth();

  const dispatch = useDispatch();

  const history = useHistory();

  const emailRef = useRef();

  const passwordRef = useRef();

  const [errorIsVisible, setErrorIsVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const loginHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailRef.current.value;

    const enteredPassword = passwordRef.current.value;

    if (loginIsValid(enteredEmail, enteredPassword)) {
      signInWithEmailAndPassword(auth, enteredEmail, enteredPassword)
        .then((userCredential) => {
          const admin = userCredential.user;

          if (admin.emailVerified) {
            const db = getDatabase();

            const personalInformationRef = ref(
              db,
              "adminsList/" + admin.uid + "/personalInformation"
            );

            onValue(personalInformationRef, (snapshot) => {
              const personalInformation = snapshot.val();

              dispatch(
                authActions.authenticateAdmin({
                  authenticatedAdmin: {
                    email: admin.email,
                    firstName: personalInformation.firstName,
                    id: admin.uid,
                    lastName: personalInformation.lastName,
                  },
                })
              );
            });

            history.push("/");
          } else if (!admin.emailVerified) {
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

  const redirectToForgotPasswordPageHandler = () => {
    history.push("/forgot-password");
  };

  const redirectToRegisterPageHandler = () => {
    history.push("/register");
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
        <CustomInput id="check" label="Remember me" type="checkbox" />
        <CustomButton onClick={loginHandler} text="Log in" />
        <CustomText
          onClick={redirectToRegisterPageHandler}
          text="Register here"
        />
        <CustomText
          onClick={redirectToForgotPasswordPageHandler}
          text="Forgot password"
        />
      </Form>
    </Container>
  );
};

export default Login;
