import React from "react";
import styles from "./style.module.css";

type OperationButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
};

const OperationButton = ({ children, onClick }: OperationButtonProps) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};

export default OperationButton;
