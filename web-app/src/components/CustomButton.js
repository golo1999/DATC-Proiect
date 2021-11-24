import classes from "./CustomButton.module.css";

const CustomButton = (props) => {
  return (
    <button className={classes.button} onClick={props.onClick}>
      {props.text}
    </button>
  );
};

export default CustomButton;
