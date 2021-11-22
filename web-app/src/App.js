import { Fragment, useState } from "react";

import Home from "./components/Home";
import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";
import TopBar from "./components/TopBar";

import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <Fragment>
      <TopBar />
      {!isLoggedIn && <Login />}
      {isLoggedIn && <Home />}
    </Fragment>
  );
};

export default App;
