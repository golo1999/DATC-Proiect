import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import CustomText from "../CustomText";

import classes from "./Login.module.css";

const Login = () => {
  return (
    <form className={classes.form}>
      <CustomInput id="email" placeholder="Email" type="email" />
      <CustomInput id="psw" placeholder="Password" type="password" />
      <CustomInput id="check" type="checkbox" />
      <CustomButton text="Log in" />
      <CustomText text="Register here" />
    </form>
  );
};

export default Login;
