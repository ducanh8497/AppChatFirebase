import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import '@coreui/coreui/dist/css/coreui.min.css';
import SignIn from "./components/Auth/signIn";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "firebase/compat/auth";
import PrivateRoute from "./routers/PrivateRoute";
import SignUp from "./components/Auth/signUp";
import 'react-toastify/dist/ReactToastify.css';
import Main from "./components/Main/Main";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <PrivateRoute>
                <Main />
              </PrivateRoute>
            }
          />
          <Route exact path="/sign-in" element={<SignIn />} />
          <Route exact path="/sign-up" element={<SignUp />} />
          <Route exact path="/profile" element={<Main />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
