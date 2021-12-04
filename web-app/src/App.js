import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { Fragment, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";

import { authActions } from "./store/auth-slice";
import { reportsListActions } from "./store/reports-list-slice";
import { usersListActions } from "./store/users-list-slice";

import AllReports from "./components/AllReports";
import AllUsers from "./components/AllUsers";
import Login from "./components/Authentication/Login";
import Profile from "./components/Profile";
import Register from "./components/Authentication/Register";
import ReportDetails from "./components/ReportDetails";
import TopBar from "./components/TopBar";
import UserProfile from "./components/UserProfile";

import "./App.css";

const App = () => {
  const auth = getAuth();

  const db = getDatabase();

  const dispatch = useDispatch();

  const history = useHistory();

  const fetchAuthenticatedAdmin = useCallback(async () => {
    onAuthStateChanged(auth, (admin) => {
      if (admin) {
        const personalInformationRef = ref(
          db,
          "adminsList/" + admin.uid + "/personalInformation"
        );

        onValue(personalInformationRef, (snapshot) => {
          const personalInformation = snapshot.val();

          if (personalInformation) {
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
          }
        });
      }
    });
  }, [auth, db, dispatch]);

  const fetchReportsList = useCallback(async () => {
    const usersListRef = ref(db, "usersList");

    onValue(usersListRef, (snapshot) => {
      const data = snapshot.val();

      const usersList = Object.values(data);

      dispatch(reportsListActions.clearReportsList());

      usersList.forEach((userDetails) => {
        const userData = userDetails;

        const userPersonalReportsList = Object.values(userData.personalReports);

        userPersonalReportsList.forEach((report) => {
          dispatch(reportsListActions.addReport({ report }));
        });
      });
    });
  }, [db, dispatch]);

  const fetchUsersList = useCallback(async () => {
    const usersListRef = ref(db, "usersList");

    onValue(usersListRef, (snapshot) => {
      const data = snapshot.val();

      const usersList = Object.values(data);

      dispatch(usersListActions.clearUsersList());

      usersList.forEach((user) => {
        dispatch(usersListActions.addUser({ user }));
      });
    });
  }, [db, dispatch]);

  useEffect(() => {
    fetchAuthenticatedAdmin();
    fetchReportsList();
    fetchUsersList();
  }, [dispatch, fetchAuthenticatedAdmin, fetchReportsList, fetchUsersList]);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const reportsList = useSelector((state) => state.reportsList.reportsList);

  const usersList = useSelector((state) => state.usersList.usersList);

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
          {isAuthenticated && <AllReports reports={reportsList} />}
        </Route>
        <Route path="/reports/:reportId">
          {!isAuthenticated && <Redirect to="/login" />}
          {isAuthenticated && <ReportDetails />}
        </Route>
        <Route exact path="/users">
          {!isAuthenticated && <Redirect to="/login" />}
          {isAuthenticated && <AllUsers users={usersList} />}
        </Route>
        <Route path="/users/:userId">
          {!isAuthenticated && <Redirect to="/login" />}
          {isAuthenticated && <UserProfile />}
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
