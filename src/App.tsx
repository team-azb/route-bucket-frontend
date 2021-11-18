import RouteIndex from "./pages//RouteIndex";
import RouteEditor from "./pages/RouteEditor";
import SignIn from "./pages/SignIn";
import Top from "./pages/Top";
import PasswordReset from "./pages/PasswordReset";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "font-awesome/css/font-awesome.min.css";
import { pagePaths } from "./consts/uriComponents";
import { SignedInUserUserProvider } from "./contexts/signedInUserContext";

function App() {
  return (
    <Router>
      <Switch>
        <SignedInUserUserProvider>
          <Route exact path={pagePaths.TOP} children={<Top />} />
          <Route exact path={pagePaths.ROUTE_INDEX} children={<RouteIndex />} />
          <Route exact path={pagePaths.SIGN_IN} children={<SignIn />} />
          <Route path={pagePaths.ROUTE_EDITOR} children={<RouteEditor />} />
          <Route
            exact
            path={pagePaths.PASSWORD_RESET}
            children={<PasswordReset />}
          />
        </SignedInUserUserProvider>
      </Switch>
    </Router>
  );
}

export default App;
