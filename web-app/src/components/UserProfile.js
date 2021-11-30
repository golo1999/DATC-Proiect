import React from "react";
import { useSelector } from "react-redux";

import classes from "./UserProfile.module.css";

const UserProfile = (props) => {
  const selectedUser = useSelector((state) => state.user.user);

  const userPersonalInformation = selectedUser.personalInformation;

  const userPersonalReports = selectedUser.personalReports;

  console.log(selectedUser);

  return <div>{userPersonalInformation.id}</div>;
};
export default UserProfile;
