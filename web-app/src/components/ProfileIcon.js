// import { getAuth } from "firebase/auth";
// import { getDatabase, ref, onValue } from "firebase/database";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

import classes from "./ProfileIcon.module.css";

const ProfileIcon = (props) => {
  const authenticatedAdmin = props.admin;

  const adminFirstName = authenticatedAdmin.firstName;

  const firstLetter = adminFirstName.substr(0, 1);

  return <div className={classes.container}>{firstLetter}</div>;
};

export default ProfileIcon;
