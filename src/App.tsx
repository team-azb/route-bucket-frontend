import RouteIndex from "./pages//RouteIndex";
import RouteEditor from "./pages/RouteEditor";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" children={<RouteIndex />} />
        <Route path="/:routeId" children={<RouteEditor />} />
      </Switch>
    </Router>
  );
}

export default App;
