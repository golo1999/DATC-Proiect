import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { authActions } from "../store/auth-slice";
import Profile from "./Profile";

import ProfileIcon from "./ProfileIcon";

import classes from "./TopBar.module.css";

const TopBar = (props) => {
  const dispatch = useDispatch();

  const [reportsLinkIsActive, setReportsLinkIsActive] = useState(true);

  const [usersLinkIsActive, setUsersLinkIsActive] = useState(false);

  const [profileLinkIsActive, setProfileLinkIsActive] = useState(false);

  const [navbarIsExpanded, setNavbarIsExpanded] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const authenticatedAdmin = useSelector((state) => state.auth.admin);

  const auth = getAuth();

  const history = useHistory();

  const location = useLocation();

  const currentPathHandler = () => {
    if (location.pathname === "/reports") {
      if (!reportsLinkIsActive) {
        setReportsLinkIsActive((prevState) => !prevState);
      }

      if (usersLinkIsActive) {
        setUsersLinkIsActive((prevState) => !prevState);
      }

      if (profileLinkIsActive) {
        setProfileLinkIsActive((prevState) => !prevState);
      }
    } else if (location.pathname === "/users") {
      if (reportsLinkIsActive) {
        setReportsLinkIsActive((prevState) => !prevState);
      }

      if (!usersLinkIsActive) {
        setUsersLinkIsActive((prevState) => !prevState);
      }

      if (profileLinkIsActive) {
        setProfileLinkIsActive((prevState) => !prevState);
      }
    } else if (location.pathname === "/profile") {
      if (reportsLinkIsActive) {
        setReportsLinkIsActive((prevState) => !prevState);
      }

      if (usersLinkIsActive) {
        setUsersLinkIsActive((prevState) => !prevState);
      }

      if (!profileLinkIsActive) {
        setProfileLinkIsActive((prevState) => !prevState);
      }
    }
  };

  currentPathHandler();

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        // Sign out successful
        dispatch(authActions.signOutAdmin());

        if (navbarIsExpanded) {
          setNavbarIsExpanded((prevState) => !prevState);
        }

        history.push("/logout");
      })
      .catch((error) => {
        // An error occurred
      });
  };

  const redirectToReportsPageHandler = () => {
    if (navbarIsExpanded) {
      toggleNavbarHandler();
    }

    history.push("/reports");
  };

  const redirectToProfilePageHandler = () => {
    if (navbarIsExpanded) {
      toggleNavbarHandler();
    }

    history.push("/profile");
  };

  const redirectToUsersPageHandler = () => {
    if (navbarIsExpanded) {
      toggleNavbarHandler();
    }

    history.push("/users");
  };

  const toggleNavbarHandler = () => {
    setNavbarIsExpanded((prevState) => !prevState);
  };

  return (
    <Navbar
      collapseOnSelect
      className={classes.navbar}
      expand="lg"
      expanded={navbarIsExpanded}
      variant="dark"
    >
      <Container>
        <Navbar.Brand className={classes.logo}>CityDangersAlert</Navbar.Brand>
        {isAuthenticated && (
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={toggleNavbarHandler}
          />
        )}
        {isAuthenticated && (
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                active={reportsLinkIsActive}
                className={
                  reportsLinkIsActive
                    ? classes["nav-link-active"]
                    : classes["nav-link"]
                }
                onClick={redirectToReportsPageHandler}
              >
                Reports
              </Nav.Link>
              <Nav.Link
                active={usersLinkIsActive}
                className={
                  usersLinkIsActive
                    ? classes["nav-link-active"]
                    : classes["nav-link"]
                }
                onClick={redirectToUsersPageHandler}
              >
                Users
              </Nav.Link>
            </Nav>

            <Nav>
              <Nav.Link
                active={profileLinkIsActive}
                className={
                  profileLinkIsActive
                    ? classes["nav-link-active"]
                    : classes["nav-link"]
                }
                onClick={redirectToProfilePageHandler}
              >
                {!navbarIsExpanded && (
                  <ProfileIcon admin={authenticatedAdmin} />
                )}
                {navbarIsExpanded && <Profile />}
              </Nav.Link>
              <Nav.Link className={classes["nav-link"]} onClick={logoutHandler}>
                Log out
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
};

export default TopBar;
