import { useHistory } from "react-router";

import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import CustomText from "../CustomText";

import classes from "./Register.module.css";

const Register = () => {
  const history = useHistory();

  const redirectToLoginPageHandler = () => {
    history.push("/login");
  };

  const registerHandler = (event) => {
    event.preventDefault();

    history.push("/login");
  };

  return (
    <form className={classes.form}>
      <CustomInput id="email" placeholder="Email" type="email" />
      <CustomInput id="psw" placeholder="Password" type="password" />
      <CustomInput id="fname" placeholder="First name" type="text" />
      <CustomInput id="lname" placeholder="Last name" type="text" />
      <CustomButton onClick={registerHandler} text="Register" />
      <CustomText onClick={redirectToLoginPageHandler} text="Log in here" />
    </form>
  );
};

export default Register;
