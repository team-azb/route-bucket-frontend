import React from "react";
import { Link } from "react-router-dom";
import { pagePaths } from "../../../consts/uriComponents";
import "./style.css";

const Header = () => {
  return (
    <div className="header__container">
      <Link className="header__link" to={pagePaths.ROUTE_INDEX}>
        ルート検索
      </Link>
      <Link className="header__link" to={pagePaths.SIGN_IN}>
        サインイン
      </Link>
    </div>
  );
};

export default Header;
