import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { Fragment, useEffect } from "react";
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
import TopBar from "./components/TopBar";

import "./App.css";
import UserProfile from "./components/UserProfile";
import ReportDetails from "./components/ReportDetails";

const App = () => {
  const auth = getAuth();

  const db = getDatabase();

  const dispatch = useDispatch();

  const history = useHistory();

  const fetchAuthenticatedAdmin = async () => {
    onAuthStateChanged(auth, (admin) => {
      if (admin) {
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
  };

  const fetchReportsList = async () => {
    onAuthStateChanged(auth, (admin) => {
      if (admin) {
        const usersListRef = ref(db, "usersList");

        onValue(usersListRef, (snapshot) => {
          const data = snapshot.val();

          const usersList = Object.values(data);

          usersList.forEach((userDetails) => {
            const userData = userDetails;

            const userPersonalReportsList = Object.values(
              userData.personalReports
            );

            userPersonalReportsList.forEach((report) => {
              dispatch(reportsListActions.addReport({ report }));
            });
          });
        });
      }
    });
  };

  const fetchUsersList = async () => {
    onAuthStateChanged(auth, (admin) => {
      if (admin) {
        const usersListRef = ref(db, "usersList");

        onValue(usersListRef, (snapshot) => {
          const data = snapshot.val();

          const usersList = Object.values(data);

          usersList.forEach((user) => {
            dispatch(usersListActions.addUser({ user }));
          });
        });
      }
    });
  };

  useEffect(() => {
    fetchAuthenticatedAdmin();
    fetchReportsList();
    fetchUsersList();
  }, [dispatch]);

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
