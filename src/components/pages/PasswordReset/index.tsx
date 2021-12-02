import React, { useState } from "react";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "../../../api/auth";
import "./style.css";

const PasswordReset = () => {
  const [emailInput, setEmailInput] = useState<string>("");
  const sendHandler = async () => {
    try {
      await sendPasswordResetEmail(emailInput);
      toast.success("メールを送信しました。");
    } catch (error) {
      toast.error("メールを送信できませんでした。");
    }
  };

  return (
    <div className="pwd-reset__container">
      <h1 className="pwd-reset__title">パスワード再設定</h1>
      <hr />
      <div className="pwd-reset__form--wrapper">
        <div className="pwd-reset__form--container">
          <h2>
            登録したメールアドレスにパスワード再設定用のリンクを送信します。
          </h2>
          <div className="pwd-reset__form--field">
            <label className="pwd-reset__form--label" htmlFor="email">
              メールアドレス
            </label>
            <input
              className="signin__form--input"
              value={emailInput}
              onChange={(event) => {
                setEmailInput(event.target.value);
              }}
              type="email"
            />
          </div>
          <button className="pwd-reset__form--button" onClick={sendHandler}>
            送信
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
