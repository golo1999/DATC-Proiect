import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";

import { authActions } from "./store/auth-slice";
import { locationActions } from "./store/location-slice";
import { reportsListActions } from "./store/reports-list-slice";
import { usersListActions } from "./store/users-list-slice";

import AllReports from "./components/AllReports";
import AllUsers from "./components/AllUsers";
import Login from "./components/Authentication/Login";
import Map from "./components/Map";
import PageNotFound from "./components/PageNotFound";
import Profile from "./components/Profile";
import Register from "./components/Authentication/Register";
import ReportDetails from "./components/ReportDetails";
import SplashScreen from "./components/SplashScreen";
import TopBar from "./components/TopBar";
import UserProfile from "./components/UserProfile";

import "./App.css";

const App = () => {
  const auth = getAuth();

  const db = getDatabase();

  const dispatch = useDispatch();

  const location = useLocation();

  const { REACT_APP_GOOGLE_KEY: GOOGLE_KEY } = process.env;

  const googleMapURL =
    "https://maps.googleapis.com/maps/api/js?key=" +
    GOOGLE_KEY +
    "&v=3.exp&libraries=geometry,drawing,places";

  const history = useHistory();

  const [topBarIsVisible, setTopBarIsVisible] = useState(false);

  const fetchCurrentLocation = useCallback(async () => {
    try {
      // const details = {
      //   headers: { "Content-Type": "application/json" },
      //   method: "POST",
      // };

      const response = await fetch("http://ip-api.com/json/?fields=223");

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      dispatch(
        locationActions.setAdminLocation({
          newLocation: { latitude: data.lat, longitude: data.lon },
        })
      );

      // setMovies(loadedMovies);
    } catch (error) {
      // setError(error.message);
    }
  }, [dispatch]);

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

      dispatch(locationActions.clearReportsLocationList());

      usersList.forEach((userDetails) => {
        const userData = userDetails;

        const userPersonalReportsList = Object.values(userData.personalReports);

        userPersonalReportsList.forEach((report) => {
          const reportLocation = report.location;

          dispatch(reportsListActions.addReport({ report }));

          if (reportLocation) {
            dispatch(
              locationActions.addReportLocation({
                newReportLocation: {
                  category: report.category,
                  name: report.note ? report.note : "No note provided",
                  position: {
                    lat: reportLocation.latitude,
                    lng: reportLocation.longitude,
                  },
                },
              })
            );
          }
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
    fetchCurrentLocation();
    fetchReportsList();
    fetchUsersList();
  }, [
    dispatch,
    fetchAuthenticatedAdmin,
    fetchCurrentLocation,
    fetchReportsList,
    fetchUsersList,
  ]);

  useEffect(() => {
    if (location.pathname === "/page-not-found" || location.pathname === "/") {
      if (!topBarIsVisible) {
        setTopBarIsVisible((prevValue) => !prevValue);
      }
    } else if (topBarIsVisible) {
      setTopBarIsVisible((prevValue) => !prevValue);
    }
  }, [location.pathname]);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const adminLocation = useSelector((state) => state.location.adminLocation);

  const reportsList = useSelector((state) => state.reportsList.reportsList);

  const reportsLocationList = useSelector(
    (state) => state.location.reportsLocationList
  );

  const usersList = useSelector((state) => state.usersList.usersList);

  // navigator.geolocation.getCurrentPosition((position) => {
  //   console.log("CURRENT POSITION");
  //   console.log(position.coords.latitude + " " + position.coords.longitude);
  // });

  return (
    <Fragment>
      {!topBarIsVisible && <TopBar />}
      <Switch>
        <Route
          exact
          path="/"
          // component={() => <SplashScreen isAuthenticated={isAuthenticated} />}
        >
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
        <Route
          exact
          path="/reports"
          component={() => <AllReports reports={reportsList} />}
        >
          {/* {!isAuthenticated && <Redirect to="/login" />} */}
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
              reportsLocation={reportsLocationList}
              // isMarkerShown // for showing a marker
              googleMapURL={googleMapURL}
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
        <Route
          exact
          path="/page-not-found"
          component={() => <PageNotFound history={history} />}
        />
        <Route path="*">
          <Redirect to="/page-not-found" />
        </Route>
      </Switch>
    </Fragment>
  );
};

export default App;
