import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import { Link } from "react-router-dom";
import { pagePaths } from "../../consts/path";

const PrivateTemplate: React.FC = ({ children }) => {
  const user = useContext(UserContext);

  const redirectMessage = (
    <div>
      <p>ページを閲覧するためにはサインインをしてください</p>
      <Link to={pagePaths.SIGN_IN}>サインインページはこちら</Link>
    </div>
  );

  return <>{user ? children : redirectMessage}</>;
};

export default PrivateTemplate;
