import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

import { getAllReports } from "./lib/api";
import { auth, provider } from "./Firebase";
import {
  setActiveUser,
  setUserLogoutState,
  selectUserName,
  selectUserEmail,
} from "./store/user-slice";

import AllReports from "./components/AllReports";
import AllUsers from "./components/AllUsers";
import Home from "./components/Home";
import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";
import TopBar from "./components/TopBar";
import UserProfile from "./components/UserProfile";

import "./App.css";

const App = () => {
  const auth = getAuth();

  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user != null) {
        setIsLoggedIn((previousValue) => !previousValue);
      }

      // console.log(user != null ? user.uid : "no user is authenticated");
    });
  }, []);

  const signInHandler = (email, password) => {
    // auth
    //   .signInWithEmailAndPassword(email, password)
    //   .then((result) => {
    //     dispatch(setActiveUser({ userName: "gigel", userEmail: email }));
    //   })
    //   .catch((err) => {});
  };

  const signOutHandler = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(setUserLogoutState());
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <Fragment>
      <TopBar />
      <Switch>
        <Route exact path="/">
          {!isLoggedIn && <Redirect to="/login" />}
          {/* <Home /> */}
          {isLoggedIn && <Redirect to="/reports" />}
        </Route>
        <Route exact path="/login">
          {isLoggedIn && <Redirect to="/" />}
          {!isLoggedIn && <Login />}
        </Route>
        <Route exact path="/register">
          {isLoggedIn && <Redirect to="/" />}
          {!isLoggedIn && <Register />}
        </Route>
        <Route exact path="/reports">
          {!isLoggedIn && <Redirect to="/login" />}
          {isLoggedIn && <AllReports />}
        </Route>
        <Route exact path="/users">
          {!isLoggedIn && <Redirect to="/login" />}
          {isLoggedIn && <AllUsers />}
        </Route>
        <Route exact path="/profile">
          {!isLoggedIn && <Redirect to="/login" />}
          {isLoggedIn && <UserProfile />}
        </Route>
        <Route exact path="/logout">
          <Redirect to="/" />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Fragment>
  );
};

export default App;
