// Custom CSS
import { MouseEventHandler } from "react";
import classes from "./CustomText.module.css";

type Props = { onClick: MouseEventHandler; text: string };

const CustomText = ({ onClick, text }: Props) => {
  return (
    <p className={classes["custom-text"]} onClick={onClick}>
      {text}
    </p>
  );
};

export default CustomText;
