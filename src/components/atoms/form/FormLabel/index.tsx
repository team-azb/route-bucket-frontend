import React from "react";
import styles from "./style.module.css";

type FormLabelProps = {
  children?: React.ReactNode;
  htmlFor?: string;
  className?: string;
};

/** フォームのフィールドの項目名等を表示するラベル */
const FormLabel = ({ children, htmlFor, className }: FormLabelProps) => {
  return (
    <label className={[styles.label, className].join(" ")} htmlFor={htmlFor}>
      {children}
    </label>
  );
};

export default FormLabel;
