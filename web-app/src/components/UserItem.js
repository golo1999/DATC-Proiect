import React from "react";

import { Card } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";

import classes from "./UserItem.module.css";

const UserItem = (props) => {
  const user = props.user;

  const userPersonalInformation = user.personalInformation;

  const checkUserDetailsHandler = () => {
    alert("check user details clicked " + userPersonalInformation.id);
  };

  return (
    <li>
      <Card className={classes.card}>
        <Card.Body className={classes["card-body"]}>
          <div className={classes["user-name-container"]}>
            {userPersonalInformation.firstName}
          </div>
          <div className={classes["user-level-container"]}>
            {userPersonalInformation.level}
          </div>
          <div className={classes["icons-container"]}>
            <FaAngleRight onClick={checkUserDetailsHandler} />
          </div>
        </Card.Body>
      </Card>
    </li>
  );
};

export default UserItem;
