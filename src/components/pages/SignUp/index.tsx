import React from "react";
import SignUpForm from "../../organisms/SignUpForm";
import "./style.css";

const SignUp = () => {
  return (
    <div className="signup__container">
      <h1 className="signup__title">サインアップ</h1>
      <hr />
      <SignUpForm />
    </div>
  );
};

export default SignUp;
