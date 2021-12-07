import React, { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useHistory } from "react-router";

import classes from "./SplashScreen.module.css";

const SplashScreen = () => {
  const history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => {
      history.replace({ pathname: "/reports" });
      //   history.push("/reports");
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [history]);

  return (
    <div className={classes["overall-container"]}>
      <div className={classes["content-container"]}>
        <h1 className={classes["application-name"]}>CityDangersAlertApp</h1>
        <Spinner
          animation="border"
          className={classes["spinner"]}
          role="status"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
