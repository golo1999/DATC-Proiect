// NPM
import React from "react";
import { useHistory } from "react-router";

// Bootstrap
import { Button } from "react-bootstrap";

// Custom CSS
import classes from "./PageNotFound.module.css";

const PageNotFound = () => {
  const history = useHistory();

  const goBackHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    history.goBack();
  };

  return (
    <div className={classes["main-container"]}>
      <div>
        <div className={classes["message-container"]}>
          <h1 className={classes["error-code"]}>404</h1>
          <h2>Page not found</h2>
        </div>
        <div className={classes["button-container"]}>
          <Button
            className={classes.button}
            onClick={goBackHandler}
            size="lg"
            variant="outline-primary"
          >
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
