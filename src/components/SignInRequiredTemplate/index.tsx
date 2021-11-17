import React, { useContext } from "react";
import { AuthentificatedUserContext } from "../../contexts/authentificatedUserContext";
import { Link } from "react-router-dom";
import { pagePaths } from "../../consts/path";

const SignInRequiredTemplate: React.FC = ({ children }) => {
  const user = useContext(AuthentificatedUserContext);

  const redirectMessage = (
    <div>
      <p>ページを閲覧するためにはサインインをしてください</p>
      <Link to={pagePaths.SIGN_IN}>サインインページはこちら</Link>
    </div>
  );

  return <>{user ? children : redirectMessage}</>;
};

export default SignInRequiredTemplate;
