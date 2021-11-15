import React, { useState } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useHistory } from "react-router";
import { pagePaths } from "../../consts/path";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const history = useHistory();
  const onClickSigninHandler = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      alert("ログイン成功");
      history.push(pagePaths.ROUTE_INDEX);
    } catch (error) {
      alert("ログイン失敗");
    }
  };

  return (
    <>
      <h1>サインイン</h1>
      <div>
        <div>
          <label htmlFor="email">email</label>
          <input
            value={emailInput}
            onChange={(event) => {
              setEmailInput(event.target.value);
            }}
            name="email"
            type="email"
          />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            value={passwordInput}
            onChange={(event) => {
              setPasswordInput(event.target.value);
            }}
            name="password"
            type="password"
          />
        </div>
        <div>
          <input
            onClick={onClickSigninHandler}
            type="button"
            value="サインイン"
          />
        </div>
        <Link to={pagePaths.PASSWORD_RESET}>パスワードを忘れた方はこちら</Link>
      </div>
    </>
  );
};

export default SignIn;
