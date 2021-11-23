import React, { ChangeEvent, useState } from "react";
import { useHistory } from "react-router";
import {
  signUp,
  CreateUserRequestBody,
  signInWithEmailAndPassword,
} from "../../../api/auth";
import { hasAxiosResponseMessage } from "../../../api/helpers";
import { pagePaths } from "../../../consts/uriComponents";
import "./style.css";

type Form = {
  id: string;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

const SignUp = () => {
  const [form, setForm] = useState<Form>({
    id: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const history = useHistory();

  const changeFormHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };

  const sendFormHandler = async () => {
    try {
      await signUp(form as CreateUserRequestBody);
    } catch (error) {
      if (hasAxiosResponseMessage(error)) {
        alert(error.response.data.message);
        return;
      }
    }
    try {
      await signInWithEmailAndPassword(form.email, form.password);
      alert("サインイン成功");
      history.push(pagePaths.ROUTE_INDEX);
    } catch (error) {
      alert("サインイン失敗");
    }
  };

  return (
    <div className="signup__container">
      <h1 className="signup__title">サインアップ</h1>
      <hr />
      <div className="signup__form--wrapper">
        <div className="signup__form--container">
          <div className="signup__form--field">
            <label htmlFor="text" className="signup__form--label">
              ID
              <br />
              <span className="signup__form--span">
                ※ユーザーの識別のために使用されます。後から変更不可することはできません。
              </span>
            </label>
            <input
              type="text"
              name="id"
              className="signup__form--input"
              onChange={changeFormHandler}
            />
          </div>
          <div className="signup__form--field">
            <label htmlFor="text" className="signup__form--label">
              ニックネーム
              <br />
              <span className="signup__form--span">
                ※IDとは別にユーザー名として使用されます。後から変更可能です。
              </span>
            </label>
            <input
              type="text"
              name="name"
              className="signup__form--input"
              onChange={changeFormHandler}
            />
          </div>
          <div className="signup__form--field">
            <label htmlFor="email" className="signup__form--label">
              メールアドレス
            </label>
            <input
              type="text"
              name="email"
              className="signup__form--input"
              onChange={changeFormHandler}
            />
          </div>
          <div className="signup__form--field">
            <label htmlFor="password" className="signup__form--label">
              パスワード
            </label>
            <input
              type="password"
              name="password"
              className="signup__form--input"
              onChange={changeFormHandler}
            />
          </div>
          <div className="signup__form--field">
            <label htmlFor="confirmation" className="signup__form--label">
              パスワード(確認用)
            </label>
            <input
              type="password"
              name="password_confirmation"
              className="signup__form--input"
              onChange={changeFormHandler}
            />
          </div>
          <div className="signup__form--field">
            <button className="signup__form--button" onClick={sendFormHandler}>
              サインアップ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
