import React, { useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { pagePaths } from "../../../consts/uriComponents";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "../../../api/auth";
import styles from "./style.module.css";

const SignIn = () => {
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const history = useHistory();
  const signInHandler: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(emailInput, passwordInput);
      toast.success("サインイン成功");
      history.push(pagePaths.routeIndex());
    } catch (error) {
      toast.error("サインイン失敗");
    }
  };

  return (
    <form className={styles.container}>
      <h1 className={styles.title}>サインイン</h1>
      <hr />
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.formField}>
            <label className={styles.formLabel} htmlFor="email">
              メールアドレス
            </label>
            <input
              className={styles.formInput}
              value={emailInput}
              onChange={(event) => {
                setEmailInput(event.target.value);
              }}
              name="email"
              type="email"
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel} htmlFor="password">
              パスワード
            </label>
            <input
              className={styles.formInput}
              value={passwordInput}
              onChange={(event) => {
                setPasswordInput(event.target.value);
              }}
              name="password"
              type="password"
            />
          </div>
          <div className={styles.formField}>
            <button className={styles.formButton} onClick={signInHandler}>
              サインイン
            </button>
            <Link className={styles.formAnchor} to={pagePaths.passwordReset()}>
              パスワードを忘れた場合
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignIn;
