import React from "react";
import { Link } from "react-router-dom";
import { pagePaths } from "../../consts/path";
import { signOut, getAuth } from "firebase/auth";

const Top = () => {
  const onClickSignoutHandler = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      alert("サインアウト成功");
    } catch (error) {
      alert("サインアウト失敗");
    }
  };

  return (
    <>
      <h1>トップページ</h1>
      <ul>
        <li>
          <Link to={pagePaths.ROUTE_INDEX}>
            <button>ルート一覧</button>
          </Link>
        </li>
        <li>
          <Link to={pagePaths.SIGN_IN}>
            <button>サインイン</button>
          </Link>
        </li>
        <li>
          <button onClick={onClickSignoutHandler}>サインアウト</button>
        </li>
      </ul>
    </>
  );
};

export default Top;
