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
          <Route exact path={pagePaths.TOP} children={<Top />} />
          <Route exact path={pagePaths.ROUTE_INDEX} children={<RouteIndex />} />
          <Route exact path={pagePaths.SIGN_IN} children={<SignIn />} />
          <Route exact path={pagePaths.SIGN_UP} children={<SignUp />} />
          <Route path={pagePaths.ROUTE_EDITOR} children={<RouteEditor />} />
          <Route
            exact
            path={pagePaths.PASSWORD_RESET}
            children={<PasswordReset />}
          />
          <Route path={pagePaths.MYPAGE} children={<Mypage />} />
        </Switch>
      </SignedInUserInfoProvider>
    </Router>
  );
}

export default App;
