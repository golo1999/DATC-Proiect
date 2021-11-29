import { getAuth, signOut } from "firebase/auth";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useHistory } from "react-router";

import classes from "./TopBar.module.css";

const TopBar = (props) => {
  const auth = getAuth();

  const history = useHistory();

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        // Sign out successful

        // logging out: working, redirecting to /logout: not working
        history.push("/logout");
      })
      .catch((error) => {
        // An error occurred
      });
  };

  const redirectToReportsPageHandler = () => {
    history.push("/reports");
  };

  const redirectToProfilePageHandler = () => {
    history.push("/profile");
  };

  const redirectToUsersPageHandler = () => {
    history.push("/users");
  };

  return (
    <Navbar
      collapseOnSelect
      className={classes.navbar}
      expand="lg"
      variant="dark"
    >
      <Container>
        <Navbar.Brand>City Dangers Alert</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={redirectToReportsPageHandler}>Reports</Nav.Link>
            <Nav.Link onClick={redirectToUsersPageHandler}>Users</Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown
              title="Profile"
              id="collasible-nav-dropdown"
              menuVariant="dark"
            >
              <NavDropdown.Item onClick={redirectToProfilePageHandler}>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logoutHandler}>
                Log out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopBar;
