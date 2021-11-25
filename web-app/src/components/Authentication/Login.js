import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRef } from "react";
import { useHistory } from "react-router";

import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import CustomText from "../CustomText";

import classes from "./Login.module.css";

const Login = () => {
  const auth = getAuth();

  const history = useHistory();

  const emailRef = useRef();

  const passwordRef = useRef();

  // let user = null;

  //

  // console.log("before");

  // console.log(user != null ? user.uid : "no user is authenticated");

  // // console.log(auth.currentUser ? auth.currentUser.email : "no user");

  // onAuthStateChanged(auth, (user) => {
  //   if (user != null) {
  //     console.log("user has been set");
  //   } else console.log("user hasn't been set");

  //   // console.log(user != null ? user.uid : "no user is authenticated");
  // });

  // console.log(user != null ? user.uid : "no user is authenticated");

  // console.log("after");

  //

  const loginHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailRef.current.value;

    const enteredPassword = passwordRef.current.value;

    signInWithEmailAndPassword(auth, enteredEmail, enteredPassword)
      .then((userCredential) => {
        const user = userCredential.user;

        console.log("logged in user email: " + user.email);

        history.push("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode + " " + errorMessage);
      });
  };

  const redirectToRegisterPageHandler = () => {
    history.push("/register");
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
