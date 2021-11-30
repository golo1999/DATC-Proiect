import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { authActions } from "../store/auth-slice";

import ProfileIcon from "./ProfileIcon";

import classes from "./TopBar.module.css";

const TopBar = (props) => {
  const dispatch = useDispatch();

  const [navbarIsExpanded, setNavbarIsExpanded] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const authenticatedAdmin = useSelector((state) => state.auth.admin);

  const auth = getAuth();

  const history = useHistory();

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
              <Nav.Link onClick={redirectToReportsPageHandler}>
                Reports
              </Nav.Link>
              <Nav.Link onClick={redirectToUsersPageHandler}>Users</Nav.Link>
            </Nav>

            <Nav>
              <Nav.Link onClick={redirectToProfilePageHandler}>
                <ProfileIcon admin={authenticatedAdmin} />
              </Nav.Link>
              <Nav.Link onClick={logoutHandler}>Log out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
};

export default TopBar;
