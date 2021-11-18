import React, { useContext } from "react";
import { SignedInUserUserContext } from "../../../contexts/signedInUserContext";
import { Link } from "react-router-dom";
import { pagePaths } from "../../../consts/uriComponents";

const SignInRequiredTemplate: React.FC = ({ children }) => {
  const signedInUser = useContext(SignedInUserUserContext);

  const redirectMessage = (
    <div>
      <p>ページを閲覧するためにはサインインをしてください</p>
      <Link to={pagePaths.SIGN_IN}>サインインページはこちら</Link>
    </div>
  );

  return <>{signedInUser ? children : redirectMessage}</>;
};

export default SignInRequiredTemplate;
