import React from "react";
import SignUpForm from "../../organisms/SignUpForm";
import styles from "./style.module.css";

const SignUp = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>サインアップ</h1>
      <hr />
      <SignUpForm />
    </div>
  );
};

export default SignUp;
