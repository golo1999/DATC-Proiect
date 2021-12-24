// NPM
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { MutableRefObject, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

// Redux
import { authActions } from "../../store/auth-slice";

// Models
import AdminPersonalInformation from "../../models/AdminPersonalInformation";

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

  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;

  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;

  const [rememberMeIsChecked, setRememberMeIsChecked] = useState(false);

  const [errorIsVisible, setErrorIsVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const loginHandler = (event: React.MouseEvent) => {
    event.preventDefault();

    const enteredEmail = emailRef.current.value;

    const enteredPassword = passwordRef.current.value;

    if (loginIsValid(enteredEmail, enteredPassword)) {
      const persistence = rememberMeIsChecked
        ? browserLocalPersistence
        : browserSessionPersistence;

      setPersistence(auth, persistence)
        .then(() => {
          signInWithEmailAndPassword(auth, enteredEmail, enteredPassword)
            .then((userCredential) => {
              const admin = userCredential.user;

              if (admin && admin.emailVerified) {
                const db = getDatabase();

                const personalInformationRef = ref(
                  db,
                  `adminsList/${admin.uid}/personalInformation`
                );

                onValue(personalInformationRef, (snapshot) => {
                  const personalInformation: AdminPersonalInformation =
                    snapshot.val();

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
                showError("Please verify your email");
              }
            })
            .catch(() => {
              showError("Incorrect username or password");
            });
        })
        .catch((error) => {
          showError(error.message);
        });
    } else {
      const errMsg: string =
        enteredEmail.length === 0 && enteredPassword.length === 0
          ? "Email and password should not be empty"
          : enteredEmail.length === 0
          ? "Email should not be empty"
          : enteredPassword.length === 0
          ? "Password should not be empty"
          : !emailIsValid(enteredEmail) && !passwordIsValid(enteredPassword)
          ? "Email and password are not valid"
          : !emailIsValid(enteredEmail)
          ? "Email is not valid"
          : !passwordIsValid(enteredPassword)
          ? "Password should have at least 8 characters"
          : "";

      showError(errMsg);
    }
  };

  const redirectHandler = (route: string) => {
    history.push(route);
  };

  const rememberMeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked: boolean = event.target.checked;

    if (rememberMeIsChecked !== checked) {
      setRememberMeIsChecked(checked);
    }
  };

  const showError = (message: string) => {
    if (!errorIsVisible) {
      setErrorIsVisible((previousValue) => !previousValue);
    }

    if (errorMessage !== message) {
      setErrorMessage(message);
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
          id="check"
          label="Remember me"
          onChange={rememberMeHandler}
          type="checkbox"
        />
        <CustomButton onClick={loginHandler} text="Log in" />
        <CustomText
          onClick={() => redirectHandler("/register")}
          text="Register here"
        />
        <CustomText
          onClick={() => redirectHandler("/forgot-password")}
          text="Forgot password"
        />
      </Form>
    </Container>
  );
};

export default Login;
