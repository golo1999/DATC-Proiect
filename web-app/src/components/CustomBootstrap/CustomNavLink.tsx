// NPM
import React, { MouseEventHandler, ReactElement } from "react";

// Bootstrap
import { Nav } from "react-bootstrap";

// Custom CSS
import classes from "./CustomNavLink.module.css";

type Props = {
  active?: boolean;
  children: ReactElement | string;
  navbarIsExpanded: boolean;
  onClick: MouseEventHandler;
};

const CustomNavLink = ({
  active,
  children,
  navbarIsExpanded,
  onClick,
}: Props) => {
  return (
    <Nav.Link
      active={active}
      className={
        navbarIsExpanded && active
          ? classes["nav-link-active"]
          : navbarIsExpanded && !active
          ? classes["nav-link"]
          : !navbarIsExpanded && active
          ? classes["nav-link-active-centered"]
          : classes["nav-link-centered"]
      }
      onClick={onClick}
    >
      {children}
    </Nav.Link>
  );
};

export default CustomNavLink;
