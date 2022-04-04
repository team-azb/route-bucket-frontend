import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { pagePaths } from "../../../consts/uriComponents";
import { signOut } from "../../../api/auth";

const Top = () => {
  const signOutHandler = async () => {
    try {
      await signOut();
      toast.success("サインアウトに成功しました。");
    } catch (error) {
      toast.error("サインアウトに失敗しました。");
    }
  };

  return (
    <>
      <h1>トップページ</h1>
      <ul>
        <li>
          <Link to={pagePaths.routeIndex()}>
            <button>ルート一覧</button>
          </Link>
        </li>
        <li>
          <Link to={pagePaths.signIn()}>
            <button>サインイン</button>
          </Link>
        </li>
        <li>
          <Link to={pagePaths.signUp()}>
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
