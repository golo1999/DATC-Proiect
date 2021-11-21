import classes from "./CustomText.module.css";

const CustomText = (props) => {
  return <p className={classes["custom-text"]}>{props.text}</p>;
};

export default CustomText;
