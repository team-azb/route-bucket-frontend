import RouteIndex from "./views/pages/RouteIndex";
import RouteEditor from "./views/pages/RouteEditor";
import SigninPage from "./views/pages/Signin";
import SignupPage from "./views/pages/Signup";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "font-awesome/css/font-awesome.min.css";
import { UserContextProvider } from "./views/contexts/UserContextProvider";

function App() {
  return (
    <Router>
      <UserContextProvider>
        <Switch>
          <Route exact path="/signin" children={<SigninPage />} />
          <Route exact path="/signup" children={<SignupPage />} />
          <Route exact path="/" children={<RouteIndex />}/>
          <Route path="/:routeId" children={<RouteEditor />} />
        </Switch>
      </UserContextProvider>
    </Router>
  );
}

export default App;
