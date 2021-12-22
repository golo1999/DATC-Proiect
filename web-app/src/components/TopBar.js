// NPM
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";

// Redux
import { authActions } from "../store/auth-slice";

// Custom components
import CustomNavLink from "./CustomNavLink.tsx";
import Logo from "./Logo.tsx";
import ProfileIcon from "./ProfileIcon.tsx";

// Custom CSS
import classes from "./TopBar.module.css";

const TopBar = () => {
  const dispatch = useDispatch();

  const [reportsLinkIsActive, setReportsLinkIsActive] = useState(true);

  const [usersLinkIsActive, setUsersLinkIsActive] = useState(false);

  const [mapLinkIsActive, setMapLinkIsActive] = useState(false);

  const [profileLinkIsActive, setProfileLinkIsActive] = useState(false);

  const [navbarIsExpanded, setNavbarIsExpanded] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const authenticatedAdmin = useSelector((state) => state.auth.admin);

  const auth = getAuth();

  const history = useHistory();

  const location = useLocation();

  const currentPathHandler = useCallback(() => {
    if (location.pathname === "/reports") {
      if (!reportsLinkIsActive) {
        setReportsLinkIsActive((prevState) => !prevState);
      }

      if (usersLinkIsActive) {
        setUsersLinkIsActive((prevState) => !prevState);
      }

      if (mapLinkIsActive) {
        setMapLinkIsActive((prevState) => !prevState);
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

      if (mapLinkIsActive) {
        setMapLinkIsActive((prevState) => !prevState);
      }

      if (profileLinkIsActive) {
        setProfileLinkIsActive((prevState) => !prevState);
      }
    } else if (location.pathname === "/map") {
      if (reportsLinkIsActive) {
        setReportsLinkIsActive((prevState) => !prevState);
      }

      if (usersLinkIsActive) {
        setUsersLinkIsActive((prevState) => !prevState);
      }

      if (!mapLinkIsActive) {
        setMapLinkIsActive((prevState) => !prevState);
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

      if (mapLinkIsActive) {
        setMapLinkIsActive((prevState) => !prevState);
      }

      if (!profileLinkIsActive) {
        setProfileLinkIsActive((prevState) => !prevState);
      }
    } else {
      if (reportsLinkIsActive) {
        setReportsLinkIsActive((prevState) => !prevState);
      }

      if (usersLinkIsActive) {
        setUsersLinkIsActive((prevState) => !prevState);
      }

      if (mapLinkIsActive) {
        setMapLinkIsActive((prevState) => !prevState);
      }

      if (profileLinkIsActive) {
        setProfileLinkIsActive((prevState) => !prevState);
      }
    }
  }, [
    location.pathname,
    mapLinkIsActive,
    profileLinkIsActive,
    reportsLinkIsActive,
    usersLinkIsActive,
  ]);

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        // Sign out successful
        dispatch(authActions.signOutAdmin());

        if (navbarIsExpanded) {
          setNavbarIsExpanded((prevState) => !prevState);
        }

        if (location.pathname !== "/logout") {
          history.push("/logout");
        }
      })
      .catch((error) => {
        // An error occurred
        console.log(error.message);
      });
  };

  const redirectHandler = (route) => {
    if (navbarIsExpanded) {
      toggleNavbarHandler();
    }

    if (location.pathname !== route) {
      history.push(route);
    }
  };

  const toggleNavbarHandler = () => {
    setNavbarIsExpanded((prevState) => !prevState);
  };

  useEffect(() => {
    currentPathHandler();
  }, [currentPathHandler]);

  return (
    <Navbar
      collapseOnSelect
      className={classes.navbar}
      expand="lg"
      expanded={navbarIsExpanded}
      variant="dark"
    >
      <Container>
        <Navbar.Brand>
          <Logo />
        </Navbar.Brand>
        {isAuthenticated && (
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={toggleNavbarHandler}
          />
        )}
        {isAuthenticated && (
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <CustomNavLink
                active={reportsLinkIsActive}
                navbarIsExpanded={navbarIsExpanded}
                onClick={() => {
                  redirectHandler("/reports");
                }}
              >
                Reports
              </CustomNavLink>

              <CustomNavLink
                active={usersLinkIsActive}
                navbarIsExpanded={navbarIsExpanded}
                onClick={() => {
                  redirectHandler("/users");
                }}
              >
                Users
              </CustomNavLink>

              <CustomNavLink
                active={mapLinkIsActive}
                navbarIsExpanded={navbarIsExpanded}
                onClick={() => {
                  redirectHandler("/map");
                }}
              >
                Map
              </CustomNavLink>
            </Nav>

            <Nav>
              <CustomNavLink
                active={profileLinkIsActive}
                navbarIsExpanded={navbarIsExpanded}
                onClick={() => {
                  redirectHandler("/profile");
                }}
              >
                {!navbarIsExpanded && (
                  <ProfileIcon admin={authenticatedAdmin} />
                )}
                {navbarIsExpanded && `Profile`}
              </CustomNavLink>

              <CustomNavLink
                navbarIsExpanded={navbarIsExpanded}
                onClick={logoutHandler}
              >
                {!navbarIsExpanded && (
                  <FaSignOutAlt className={classes["sign-out-icon"]} />
                )}
                {navbarIsExpanded && `Sign out`}
              </CustomNavLink>
            </Nav>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
};

export default TopBar;
