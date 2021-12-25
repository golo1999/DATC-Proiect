// NPM
import { Fragment, useEffect, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";

// Redux
import { fetchAuthenticatedAdmin } from "./store/auth-actions";
import { fetchCurrentLocation } from "./store/location-actions";
import { fetchReportsList } from "./store/reports-list-actions";
import { fetchUsersList } from "./store/users-list-actions";

// Utility
import { getGoogleMapsURL } from "./utility/custom-methods";

// Custom components
import AllReports from "./components/Reports/AllReports";
import AllUsers from "./components/Users/AllUsers";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import Login from "./components/Authentication/Login";
import Map from "./components/Map";
import PageNotFound from "./components/PageNotFound";
import Profile from "./components/Profile/Profile";
import Register from "./components/Authentication/Register";
import ReportDetails from "./components/Reports/ReportDetails";
import TopBar from "./components/TopBar/TopBar";
import UserProfile from "./components/Users/UserProfile";

// Custom CSS
import "./App.css";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuthenticatedAdmin());
    dispatch(fetchCurrentLocation());
    dispatch(fetchReportsList());
    dispatch(fetchUsersList());
  }, [dispatch]);

  const location = useLocation();

  const history = useHistory();

  const [topBarIsVisible, setTopBarIsVisible] = useState(true);

  useEffect(() => {
    if (location.pathname === "/page-not-found" || location.pathname === "/") {
      if (!topBarIsVisible) {
        setTopBarIsVisible((prevValue) => !prevValue);
      }
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
