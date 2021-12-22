// Bootstrap
import { MdLocationCity } from "react-icons/md";

// Custom CSS
import classes from "./Logo.module.css";

const Logo = () => {
  return (
    <div className={classes.container}>
      <MdLocationCity className={classes["logo-icon"]} />
      <span className={classes["logo-name"]}>CityDangersAlert</span>
    </div>
  );
};

export default Logo;
