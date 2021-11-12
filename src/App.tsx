import RouteIndex from "./pages//RouteIndex";
import RouteEditor from "./pages/RouteEditor";
import SignIn from "./pages/SignIn";
import Top from "./pages/Top";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "font-awesome/css/font-awesome.min.css";
import { paths } from "./consts/path";
import { UserProvider } from "./contexts/userContext"

function App() {
  return (
    <Router>
      <Switch>
        <UserProvider>
          <Route exact path={paths.top} children={<Top />} />
          <Route path={paths.routeIndex} children={<RouteIndex />} />
          <Route path={paths.signIn} children={<SignIn />} />
          <Route path={paths.routeEditer} children={<RouteEditor />} />
        </UserProvider>
      </Switch>
    </Router>
  );
}

export default App;
