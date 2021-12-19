// Custom CSS
import classes from "./CustomText.module.css";

const CustomText = (props) => {
  return (
    <p className={classes["custom-text"]} onClick={props.onClick}>
      {props.text}
    </p>
  );
};

export default CustomText;
