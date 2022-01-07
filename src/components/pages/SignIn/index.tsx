import React, { useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { dynamicPathGenerator, pagePaths } from "../../../consts/uriComponents";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "../../../api/auth";
import PageContainer from "../../atoms/PageContainer";
import PageTitle from "../../atoms/PageTitle";
import FormField from "../../atoms/form/FormField";
import FormContainer from "../../atoms/form/FormContainer";
import SingleFormWrapper from "../../atoms/form/SingleFormWrapper";
import FormLabel from "../../atoms/form/FormLabel";
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
      const { uid } = await signInWithEmailAndPassword(
        emailInput,
        passwordInput
      );
      toast.success("サインイン成功");
      history.push(dynamicPathGenerator.mypage(uid));
    } catch (error) {
      toast.error("サインイン失敗");
    }
  };

  return (
    <PageContainer>
      <PageTitle title="サインイン" />
      <SingleFormWrapper>
        <FormContainer>
          <FormField className={styles.formField}>
            <FormLabel htmlFor="email">メールアドレス</FormLabel>
            <input
              className={styles.formInput}
              value={emailInput}
              onChange={(event) => {
                setEmailInput(event.target.value);
              }}
              name="email"
              type="email"
            />
          </FormField>
          <FormField className={styles.formField}>
            <FormLabel htmlFor="password">パスワード</FormLabel>
            <input
              className={styles.formInput}
              value={passwordInput}
              onChange={(event) => {
                setPasswordInput(event.target.value);
              }}
              name="password"
              type="password"
            />
          </FormField>
          <FormField className={styles.formField}>
            <button className={styles.formButton} onClick={signInHandler}>
              サインイン
            </button>
            <Link className={styles.formAnchor} to={pagePaths.PASSWORD_RESET}>
              パスワードを忘れた場合
            </Link>
          </FormField>
        </FormContainer>
      </SingleFormWrapper>
    </PageContainer>
  );
};

export default SignIn;
