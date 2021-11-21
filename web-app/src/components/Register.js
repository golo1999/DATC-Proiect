import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import CustomText from "./CustomText";

import classes from "./Register.module.css";

const Register = () => {
  return (
    <form className={classes.form}>
      <CustomInput id="email" placeholder="Email" type="email" />
      <CustomInput id="psw" placeholder="Password" type="password" />
      <CustomInput id="fname" placeholder="First name" type="text" />
      <CustomInput id="lname" placeholder="Last name" type="text" />
      <CustomButton text="Register" />
      <CustomText text="Log in here" />
    </form>
  );
};

export default Register;
