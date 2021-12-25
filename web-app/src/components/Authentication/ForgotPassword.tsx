// NPM
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { MutableRefObject, useRef, useState } from "react";
import { useHistory } from "react-router";

// Utility
import { emailIsValid } from "../../utility/custom-methods";

// Bootstrap
import { Container, Form } from "react-bootstrap";

// Custom components
import CustomAlert from "../CustomBootstrap/CustomAlert";
import CustomButton from "../CustomBootstrap/CustomButton";
import CustomInput from "../CustomBootstrap/CustomInput";
import CustomText from "../CustomBootstrap/CustomText";

// Custom CSS
import classes from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const auth = getAuth();

  const history = useHistory();

  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;

  const [alertIsVisible, setAlertIsVisible] = useState(false);

  const [message, setMessage] = useState("");

  const [isSuccessful, setIsSuccessful] = useState(false);

  const redirectToLoginPageHandler = () => {
    history.push("/login");
  };

  const resetPasswordHandler = (event: React.MouseEvent) => {
    event.preventDefault();

    const enteredEmail = emailRef.current.value;

    if (emailIsValid(enteredEmail)) {
      sendPasswordResetEmail(auth, enteredEmail)
        .then(() => {
          if (!isSuccessful) {
            setIsSuccessful((previousValue) => !previousValue);
          }

          setMessage("Email sent");
          redirectToLoginPageHandler();
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

      errMsg =
        enteredEmail.length === 0
          ? "Email should not be empty"
          : "Email is not valid";

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
