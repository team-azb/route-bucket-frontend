import React from "react";
import { useSignedInUserUserContext } from "../../../contexts/signedInUserContext";
import { Link } from "react-router-dom";
import { pagePaths } from "../../../consts/uriComponents";

const SignInRequiredTemplate: React.FC = ({ children }) => {
  const signedInUser = useSignedInUserUserContext();

  const redirectMessage = (
    <div>
      <p>ページを閲覧するためにはサインインをしてください</p>
      <Link to={pagePaths.SIGN_IN}>サインインページはこちら</Link>
    </div>
  );

  return <>{signedInUser ? children : redirectMessage}</>;
};

export default SignInRequiredTemplate;
