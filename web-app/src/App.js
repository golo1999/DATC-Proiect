import { Fragment, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";
import TopBar from "./components/TopBar";

import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <Fragment>
      <TopBar />
      <Switch>
        <Route exact path="/">
          {!isLoggedIn && <Redirect to="/login" />}
          <Home />
        </Route>
        <Route exact path="/login">
          {isLoggedIn && <Redirect to="/" />}
          <Login />
        </Route>
        <Route exact path="/register">
          {isLoggedIn && <Redirect to="/" />}
          <Register />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>

        {/* {!hasAccount && !isLoggedIn && (
          <Route exact path="/register">
            <Register />
          </Route>
        )}
        {hasAccount && !isLoggedIn && (
          <Route exact path="login">
            <Login />
          </Route>
        )} */}
      </Switch>
    </Fragment>
  );
};

export default App;
