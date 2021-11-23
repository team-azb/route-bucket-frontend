import React, { useState } from "react";
import { useHistory } from "react-router";
import { pagePaths } from "../../../consts/uriComponents";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "../../../api/auth";
import "./style.css";

const SignIn = () => {
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const history = useHistory();
  const signInHandler = async () => {
    try {
      await signInWithEmailAndPassword(emailInput, passwordInput);
      alert("サインイン成功");
      history.push(pagePaths.ROUTE_INDEX);
    } catch (error) {
      alert("サインイン失敗");
    }
  };

  return (
    <div className="signin__container">
      <h1 className="signin__title">サインイン</h1>
      <hr />
      <div className="signin__form--wrapper">
        <div className="singin__form--container">
          <div className="signin__form--field">
            <label className="signin__form--label" htmlFor="email">
              メールアドレス
            </label>
            <input
              className="signin__form--input"
              value={emailInput}
              onChange={(event) => {
                setEmailInput(event.target.value);
              }}
              name="email"
              type="email"
            />
          </div>
          <div className="signin__form--field">
            <label className="signin__form--label" htmlFor="password">
              パスワード
            </label>
            <input
              className="signin__form--input"
              value={passwordInput}
              onChange={(event) => {
                setPasswordInput(event.target.value);
              }}
              name="password"
              type="password"
            />
          </div>
          <div className="signin__form--field">
            <button className="signin__form--button" onClick={signInHandler}>
              サインイン
            </button>
            <Link
              className="signin__form--anchor"
              to={pagePaths.PASSWORD_RESET}
            >
              パスワードを忘れた場合
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
