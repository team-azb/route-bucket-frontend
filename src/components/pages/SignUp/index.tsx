import React, { ChangeEvent, useState } from "react";
import "./style.css";

type Form = {
  email: string;
  password: string;
  confirm: string;
};

const SignUp = () => {
  const [form, setForm] = useState<Form>({
    email: "",
    password: "",
    confirm: "",
  });

  const changeFormHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };

  const sendFormhandler = () => {
    console.log(form);
  };

  return (
    <div className="signup__container">
      <h1 className="signup__title">サインアップ</h1>
      <hr />
      <div className="signup__form--wrapper">
        <div className="signup__form--container">
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
              name="confirmation"
              className="signup__form--input"
              onChange={changeFormHandler}
            />
          </div>
          <div className="signup__form--field">
            <button className="signup__form--button" onClick={sendFormhandler}>
              サインアップ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
