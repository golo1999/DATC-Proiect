// import { getAuth } from "firebase/auth";
// import { getDatabase, ref, onValue } from "firebase/database";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

import classes from "./ProfileIcon.module.css";

const ProfileIcon = (props) => {
  const authenticatedAdmin = props.admin;

  const adminFirstName = authenticatedAdmin.firstName;

  return <div className={classes.container}>{adminFirstName.substr(0, 1)}</div>;
};

export default ProfileIcon;
