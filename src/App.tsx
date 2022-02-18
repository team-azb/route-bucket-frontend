import RouteIndex from "./components/pages/RouteIndex";
import RoutePage from "./components/pages/Routes/Route";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import Top from "./components/pages/Top";
import PasswordReset from "./components/pages/PasswordReset";
import Mypage from "./components/pages/Mypage";
import RouteNew from "./components/pages/RouteNew";
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
          <Route exact path={pagePaths.TOP} children={<Top />} />
          <Route exact path={pagePaths.ROUTE_INDEX} children={<RouteIndex />} />
          <Route exact path={pagePaths.SIGN_IN} children={<SignIn />} />
          <Route exact path={pagePaths.SIGN_UP} children={<SignUp />} />
          <Route exact path={pagePaths.ROUTE_NEW} children={<RouteNew />} />
          <Route path={pagePaths.ROUTE_EDITOR} children={<RoutePage />} />
          <Route
            exact
            path={pagePaths.PASSWORD_RESET}
            children={<PasswordReset />}
          />
          <Route path={pagePaths.MYPAGE} children={<Mypage />} />
        </Switch>
      </AuthenticationInfoProvider>
    </Router>
  );
}

export default App;
