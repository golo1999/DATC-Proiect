import { Fragment, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { getAllReports } from "./lib/api";

import AllReports from "./components/AllReports";
import AllUsers from "./components/AllUsers";
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
          {/* <Home /> */}
          <Redirect to="/reports" />
        </Route>
        <Route exact path="/login">
          {isLoggedIn && <Redirect to="/" />}
          <Login />
        </Route>
        <Route exact path="/register">
          {isLoggedIn && <Redirect to="/" />}
          <Register />
        </Route>
        <Route exact path="/reports">
          {!isLoggedIn && <Redirect to="/login" />}
          <AllReports />
        </Route>
        <Route exact path="/users">
          {!isLoggedIn && <Redirect to="/login" />}
          <AllUsers />
        </Route>
        <Route></Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Fragment>
  );
};

export default App;
