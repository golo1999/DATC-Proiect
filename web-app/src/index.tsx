import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import store from "./store";

import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";
import { Provider } from "react-redux";

ReactDOM.render(
  <Fragment>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </Fragment>,
  document.getElementById("root")
);
