import React, { useState } from "react";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "../../../api/auth";
import PageContainer from "../../atoms/PageContainer";
import PageTitle from "../../atoms/PageTitle";
import FormField from "../../atoms/form/FormField";
import FormContainer from "../../atoms/form/FormContainer";
import SingleFormWrapper from "../../atoms/form/SingleFormWrapper";
import styles from "./style.module.css";

const PasswordReset = () => {
  const [emailInput, setEmailInput] = useState<string>("");
  const sendHandler: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(emailInput);
      toast.success("メールを送信しました。");
    } catch (error) {
      toast.error("メールを送信できませんでした。");
    }
  };

  return (
    <PageContainer>
      <PageTitle title="パスワード再設定" />
      <SingleFormWrapper>
        <FormContainer>
          <h2>
            登録したメールアドレスにパスワード再設定用のリンクを送信します。
          </h2>
          <FormField className={styles.formField}>
            <label className={styles.formLabel} htmlFor="email">
              メールアドレス
            </label>
            <input
              className={styles.formInput}
              value={emailInput}
              onChange={(event) => {
                setEmailInput(event.target.value);
              }}
              type="email"
            />
          </FormField>
          <button className={styles.formButton} onClick={sendHandler}>
            送信
          </button>
        </FormContainer>
      </SingleFormWrapper>
    </PageContainer>
  );
};

export default PasswordReset;
