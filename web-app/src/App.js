import { Fragment, useState } from "react";

import Home from "./components/Home";
import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";

import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <Fragment>
      {!isLoggedIn && <Login />}
      {isLoggedIn && <Home />}
    </Fragment>
  );
};

export default App;
