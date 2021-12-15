import React from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import styles from "./style.module.css";

type DialogContentProps = {
  email: string;
  handleClose: () => void;
};

const EmailVerificationDialogContent = ({
  email,
  handleClose,
}: DialogContentProps) => {
  return (
    <>
      <DialogTitle className={styles.title}>確認メール送信完了</DialogTitle>
      <DialogContent className={styles.content}>
        <span className={styles.email}>{email}</span>
        に確認用のメールを送信しました。メールに添付したリンクにアクセスし、メールアドレスの証明を行ってください。
        <br />
        ※メールアドレスの証明を行わない場合、一部のサービス利用が制限されます。
        <DialogActions>
          <button className={styles.button} onClick={handleClose}>
            agree
          </button>
        </DialogActions>
      </DialogContent>
    </>
  );
};

export default EmailVerificationDialogContent;
