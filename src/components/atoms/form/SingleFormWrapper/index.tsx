import React from "react";
import styles from "./style.module.css";

type SingleFormWrapperProps = {
  children?: React.ReactNode;
  className?: string;
};

const SingleFormWrapper = ({ children, className }: SingleFormWrapperProps) => {
  return (
    <div className={[styles.wrapper, className].join(" ")}>{children}</div>
  );
};

export default SingleFormWrapper;
