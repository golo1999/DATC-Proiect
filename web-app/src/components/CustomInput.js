import classes from "./CustomInput.module.css";

const CustomInput = (props) => {
  return (
    <div className={classes["input-container"]}>
      <input
        autoComplete="off"
        className={classes.input}
        id={props.id}
        placeholder={props.placeholder}
        type={props.type}
      />
      {props.type === "checkbox" && <label htmlFor="check">Remember me</label>}
    </div>
  );
};

export default CustomInput;
