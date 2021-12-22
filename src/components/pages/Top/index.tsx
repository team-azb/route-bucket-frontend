import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { pagePaths } from "../../../consts/uriComponents";
import { signOut } from "../../../api/auth";

const Top = () => {
  const signOutHandler = async () => {
    try {
      await signOut();
      toast.success("サインアウト成功");
    } catch (error) {
      toast.error("サインアウト失敗");
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
          <Link to={pagePaths.SIGN_UP}>
            <button>サインアップ</button>
          </Link>
        </li>
        <li>
          <button onClick={signOutHandler}>サインアウト</button>
        </li>
      </ul>
    </>
  );
};

export default Top;
