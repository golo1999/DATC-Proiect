import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";

import classes from "./components/Login.module.css";
import classes1 from "./components/Register.module.css";

function App() {
  return (
    // <div className={classes["login-container"]}>
    //   <Login />
    // </div>

    <div className={classes1["register-container"]}>
      <Register />
    </div>
  );
}

export default App;
