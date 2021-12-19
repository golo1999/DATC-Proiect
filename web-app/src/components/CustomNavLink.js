// NPM
import React from "react";

// Bootstrap
import { Nav } from "react-bootstrap";

// Custom CSS
import classes from "./CustomNavLink.module.css";

const CustomNavLink = (props) => {
  const navbarIsExpanded = props.navbarIsExpanded;

  return (
    <Nav.Link
      active={props.active}
      className={
        navbarIsExpanded && props.active
          ? classes["nav-link-active"]
          : navbarIsExpanded && !props.active
          ? classes["nav-link"]
          : !navbarIsExpanded && props.active
          ? classes["nav-link-active-centered"]
          : classes["nav-link-centered"]
      }
      onClick={props.onClick}
    >
      {props.children}
    </Nav.Link>
  );
};

export default CustomNavLink;
