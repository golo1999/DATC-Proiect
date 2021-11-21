import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import CustomText from "./CustomText";

const Login = () => {
    return<form>
        <CustomInput id="email" type="email"/>
        <CustomInput id="psw" type="password"/>
        <CustomInput id="check" type="checkbox"/>
        <CustomButton text="Log In"/>
        <CustomText text="Register here"/>
    </form>
};

export default Login;
