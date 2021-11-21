import { Fragment } from "react";

import OptionContainer from "./OptionContainer";
import SideMenu from "./SideMenu";
import TopBar from "./TopBar";

import classes from "./Home.module.css";

const Home = (props) => {
  return (
    <Fragment>
      <TopBar />
      <SideMenu />
      <OptionContainer />
    </Fragment>
  );
};

export default Home;
