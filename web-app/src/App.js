import "./App.css";
import Login from "./components/Login";

import classes from "./components/Login.module.css";

function App() {
  return (
    <div className={classes["login-container"]}>
      <Login />
    </div>
  );
}

export default App;
