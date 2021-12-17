import React from "react";
import styles from "./style.module.css";

type SubmitButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const SubmitButton = ({ children, disabled, onClick }: SubmitButtonProps) => {
  return (
    <button className={styles.button} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default SubmitButton;
