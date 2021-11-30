import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

import { authActions } from "./store/auth-slice";

import AllReports from "./components/AllReports";
import AllUsers from "./components/AllUsers";
import Login from "./components/Authentication/Login";
import Profile from "./components/Profile";
import Register from "./components/Authentication/Register";
import TopBar from "./components/TopBar";

import "./App.css";

const App = () => {
  const auth = getAuth();

  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (admin) => {
      if (admin != null) {
        const db = getDatabase();

        const personalInformationRef = ref(
          db,
          "adminsList/" + admin.uid + "/personalInformation"
        );

        onValue(personalInformationRef, (snapshot) => {
          const personalInformation = snapshot.val();

          dispatch(
            authActions.authenticateAdmin({
              authenticatedAdmin: {
                email: admin.email,
                firstName: personalInformation.firstName,
                id: admin.uid,
                lastName: personalInformation.lastName,
              },
            })
          );
        });
      }
    });
  }, [auth, dispatch]);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  console.log(isAuthenticated);

  return (
    <Fragment>
      <TopBar />
      <Switch>
        <Route exact path="/">
          {isAuthenticated && <Redirect to="/reports" />}
          {!isAuthenticated && <Redirect to="/login" />}
        </Route>
        <Route exact path="/login">
          {isAuthenticated && <Redirect to="/" />}
          {!isAuthenticated && <Login />}
        </Route>
        <Route exact path="/register">
          {isAuthenticated && <Redirect to="/" />}
          {!isAuthenticated && <Register />}
        </Route>
        <Route exact path="/reports">
          {!isAuthenticated && <Redirect to="/login" />}
          {isAuthenticated && <AllReports />}
        </Route>
        <Route exact path="/users">
          {!isAuthenticated && <Redirect to="/login" />}
          {isAuthenticated && <AllUsers />}
        </Route>
        <Route exact path="/profile">
          {!isAuthenticated && <Redirect to="/login" />}
          {isAuthenticated && <Profile />}
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
