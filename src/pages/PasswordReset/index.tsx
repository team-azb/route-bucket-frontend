import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const PasswordReset = () => {
  const [emailInput, setEmailInput] = useState<string>("");
  const onClickSend = async () => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, emailInput);
      alert("送信しました。");
    } catch (error) {
      alert("送信できませんでした。");
    }
  };

  return (
    <>
      <p>パスワード再設定用リンクを入力したemailに送信します。</p>
      <input
        value={emailInput}
        onChange={(event) => {
          setEmailInput(event.target.value);
        }}
        type="email"
      />
      <input onClick={onClickSend} type="button" value="送信" />
    </>
  );
};

export default PasswordReset;
