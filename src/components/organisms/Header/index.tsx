import React from "react";
import { Link } from "react-router-dom";
import { pagePaths } from "../../../consts/uriComponents";
import { useSignedInUserUserContext } from "../../../contexts/signedInUserContext";
import "./style.css";

const Header = () => {
  const signedInUser = useSignedInUserUserContext();
  return (
    <div className="header__container">
      <div className="header__left-section">
        <Link className="header__left-section--link" to={pagePaths.TOP}>
          Route Bucket β
        </Link>
      </div>
      <div className="header__right-section">
        <Link
          className="header__right-section--link"
          to={pagePaths.ROUTE_INDEX}
        >
          ルート検索
        </Link>
        {signedInUser ? null : (
          <Link className="header__right-section--link" to={pagePaths.SIGN_IN}>
            サインイン
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
