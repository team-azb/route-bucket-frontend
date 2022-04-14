import React from "react";
import styles from "./style.module.css";

type SubmitButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

const SubmitButton = ({
  children,
  disabled,
  onClick,
  className,
}: SubmitButtonProps) => {
  return (
    <button
      className={[styles.button, className].join(" ")}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SubmitButton;
