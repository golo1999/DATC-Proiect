// NPM
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { Fragment, useCallback, useEffect, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";

// Redux
import { authActions } from "./store/auth-slice";
import { fetchCurrentLocation } from "./store/location-actions";
import { fetchReportsList } from "./store/reports-list-actions";
import { fetchUsersList } from "./store/users-list-actions";

// APIs
import { getReportDetails } from "./lib/api";

// Models
import AdminPersonalInformation from "./models/AdminPersonalInformation";

// Utility
import { getGoogleMapsURL } from "./utility/custom-methods";
import { DEFAULT_REPORT } from "./utility/custom-variables";

// Custom components
import AllReports from "./components/AllReports";
import AllUsers from "./components/AllUsers";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import Login from "./components/Authentication/Login";
import Map from "./components/Map";
import PageNotFound from "./components/PageNotFound";
import Profile from "./components/Profile";
import Register from "./components/Authentication/Register";
import ReportDetails from "./components/ReportDetails";
import TopBar from "./components/TopBar";
import UserProfile from "./components/UserProfile";

// Custom CSS
import "./App.css";

const App = () => {
  const auth = getAuth();

  const db = getDatabase();

  const dispatch = useDispatch();

  const location = useLocation();

  const history = useHistory();

  const [topBarIsVisible, setTopBarIsVisible] = useState(false);

  const fetchAuthenticatedAdmin = useCallback(async () => {
    onAuthStateChanged(auth, (admin) => {
      if (admin && admin.emailVerified) {
        const personalInformationRef = ref(
          db,
          `adminsList/${admin.uid}/personalInformation`
        );

        onValue(personalInformationRef, (snapshot) => {
          const personalInformation: AdminPersonalInformation = snapshot.val();

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

  useEffect(() => {
    fetchAuthenticatedAdmin();

    dispatch(fetchCurrentLocation());
    dispatch(fetchReportsList());
    dispatch(fetchUsersList());
  }, [dispatch, fetchAuthenticatedAdmin]);

  useEffect(() => {
    if (location.pathname === "/page-not-found" || location.pathname === "/") {
      if (!topBarIsVisible) {
        setTopBarIsVisible((prevValue) => !prevValue);
      }
    } else if (location.pathname.substring(0, 9) === "/reports/") {
      const reportIdFromURL = location.pathname.substring(9);

      const reportDetailsPromise = getReportDetails(reportIdFromURL);

      reportDetailsPromise
        .then((value) => {
          if (value === DEFAULT_REPORT) {
            history.push("/page-not-found");
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else if (topBarIsVisible) {
      setTopBarIsVisible((prevValue) => !prevValue);
    }
  }, [history, location.pathname, topBarIsVisible]);

  const isAuthenticated = useSelector(
    (state: RootStateOrAny) => state.auth.isAuthenticated
  );

  const adminLocation = useSelector(
    (state: RootStateOrAny) => state.location.adminLocation
  );

  const reportsList = useSelector(
    (state: RootStateOrAny) => state.reportsList.reportsList
  );

  const reportsLocationList = useSelector(
    (state: RootStateOrAny) => state.location.reportsLocationList
  );

  const usersList = useSelector(
    (state: RootStateOrAny) => state.usersList.usersList
  );

  const reports = { reportsList };

  const users = { usersList };

  useEffect(() => {
    console.log(`isAuthenticated: ${isAuthenticated}`);
  }, [isAuthenticated]);

  return (
    <Fragment>
      {!topBarIsVisible && <TopBar />}
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
        <Route exact path="/forgot-password">
          {isAuthenticated && <Redirect to="/" />}
          {!isAuthenticated && <ForgotPassword />}
        </Route>
        <Route
          exact
          path="/reports"
          component={() => <AllReports {...reports} />}
        >
          {/* {!isAuthenticated && <Redirect to="/login" />} */}
        </Route>
        <Route path="/reports/:reportId">
          {!isAuthenticated && <Redirect to="/login" />}
          {isAuthenticated && <ReportDetails />}
        </Route>
        <Route exact path="/users">
          {!isAuthenticated && <Redirect to="/login" />}
          {isAuthenticated && <AllUsers {...users} />}
        </Route>
        <Route path="/users/:userId">
          {!isAuthenticated && <Redirect to="/login" />}
          {isAuthenticated && <UserProfile />}
        </Route>
        <Route
          exact
          path="/map"
          component={() => (
            <Map
              isMarkerShown={false}
              centerCoordinates={{
                lat: adminLocation.latitude,
                lng: adminLocation.longitude,
              }}
              markerDetailsList={reportsLocationList}
              // isMarkerShown // for showing a marker
              googleMapURL={getGoogleMapsURL()}
              loadingElement={<div style={{ height: "100%" }} />}
              containerElement={<div style={{ flex: "1", height: "100%" }} />}
              mapElement={<div style={{ height: "100%" }} />}
            />
          )}
        ></Route>
        <Route exact path="/profile">
          {!isAuthenticated && <Redirect to="/login" />}
          {isAuthenticated && <Profile />}
        </Route>
        <Route exact path="/logout">
          <Redirect to="/" />
        </Route>
        <Route exact path="/page-not-found" component={PageNotFound} />
        <Route path="*">
          <Redirect to="/page-not-found" />
        </Route>
      </Switch>
    </Fragment>
  );
};

export default App;
