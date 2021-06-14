import RouteWorkbench from '../components/RouteWorkbench'
import RouteEditor from '../components/RouteEditor'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function TopPage(): JSX.Element{
  return (
    <>
    <Router>
      <Switch>
        <Route exact path="/">
          <RouteWorkbench/>
        </Route>
        <Route path="/:routeId" children={<RouteEditor/>}/>
      </Switch>
    </Router>
    </>
  );
}

export default TopPage;
