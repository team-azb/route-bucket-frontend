import React from "react";
import { Link } from "react-router-dom";
import { paths } from "../../consts/path";

const Top = () => {
  return (
    <>
      <h1>トップページ</h1>
      <ul>
        <li>
          <Link to={paths.routeIndex}>ルート一覧</Link>
        </li>
        <li>
          <Link to={paths.signIn}>サインイン</Link>
        </li>
      </ul>
    </>
  );
};

export default Top;
