import React, { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useHistory } from "react-router";

import classes from "./SplashScreen.module.css";

const SplashScreen = (props) => {
  const history = useHistory();

  const isAuthenticated = props.isAuthenticated;

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("splash: " + isAuthenticated);

      history.replace({ pathname: isAuthenticated ? "/reports" : "/login" });
      //   history.push("/reports");
    }, 1000);

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
