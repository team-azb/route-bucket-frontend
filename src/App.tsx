import RouteIndex from "./components/pages/RouteIndex";
import RouteEditor from "./components/pages/RouteEditor";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import Top from "./components/pages/Top";
import PasswordReset from "./components/pages/PasswordReset";
import Mypage from "./components/pages/Mypage";
import CreateRouteScreen from "./components/pages/RouteNew";
import Header from "./components/organisms/Header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "font-awesome/css/font-awesome.min.css";
import { pagePaths } from "./consts/uriComponents";
import { AuthenticationInfoProvider } from "./contexts/AuthenticationProvider";

function App() {
  return (
    <Router>
      <AuthenticationInfoProvider>
        <Header />
        <Switch>
          <Route exact path={pagePaths.top()}>
            <Top />
          </Route>
          <Route exact path={pagePaths.routeIndex()}>
            <RouteIndex />
          </Route>
          <Route exact path={pagePaths.signIn()}>
            <SignIn />
          </Route>
          <Route exact path={pagePaths.signUp()}>
            <SignUp />
          </Route>
          <Route exact path={pagePaths.routeNew()}>
            <CreateRouteScreen />
          </Route>
          <Route path={pagePaths.routeEditor()}>
            <RouteEditor />
          </Route>
          <Route exact path={pagePaths.passwordReset()}>
            <PasswordReset />
          </Route>
          <Route path={pagePaths.mypage()}>
            <Mypage />
          </Route>
        </Switch>
      </AuthenticationInfoProvider>
    </Router>
  );
}

export default App;
