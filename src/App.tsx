import RouteIndex from "./components/pages/RouteIndex";
import RouteEditor from "./components/pages/RouteEditor";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import Top from "./components/pages/Top";
import PasswordReset from "./components/pages/PasswordReset";
import Mypage from "./components/pages/Mypage";
import Header from "./components/organisms/Header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "font-awesome/css/font-awesome.min.css";
import { pagePaths } from "./consts/uriComponents";
import { SignedInUserInfoProvider } from "./contexts/signedInUserContext";

function App() {
  return (
    <Router>
      <SignedInUserInfoProvider>
        <Header />
        <Switch>
          <Route exact path={pagePaths.top()} children={<Top />} />
          <Route
            exact
            path={pagePaths.routeIndex()}
            children={<RouteIndex />}
          />
          <Route exact path={pagePaths.signIn()} children={<SignIn />} />
          <Route exact path={pagePaths.signUp()} children={<SignUp />} />
          <Route path={pagePaths.routeEditor()} children={<RouteEditor />} />
          <Route
            exact
            path={pagePaths.passwordReset()}
            children={<PasswordReset />}
          />
          <Route path={pagePaths.mypage()} children={<Mypage />} />
        </Switch>
      </SignedInUserInfoProvider>
    </Router>
  );
}

export default App;
