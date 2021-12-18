import React from "react";

import { MdLocationCity } from "react-icons/md";

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
