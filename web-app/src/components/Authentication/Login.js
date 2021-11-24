import { useHistory } from "react-router";

import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import CustomText from "../CustomText";

import classes from "./Login.module.css";

const Login = () => {
  const history = useHistory();

  const loginHandler = (event) => {
    event.preventDefault();

    history.push("/");
  };

  const redirectToRegisterPageHandler = () => {
    history.push("/register");
  };

  return (
    <form className={classes.form}>
      <CustomInput id="email" placeholder="Email" type="email" />
      <CustomInput id="psw" placeholder="Password" type="password" />
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
