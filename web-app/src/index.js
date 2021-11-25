import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import store from "./store/index";

import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";
import { Provider } from "react-redux";

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById("root")
);
