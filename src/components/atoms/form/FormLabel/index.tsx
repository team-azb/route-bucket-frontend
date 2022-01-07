import React from "react";
import styles from "./style.module.css";

type FormLabelProps = {
  children?: React.ReactNode;
  htmlFor?: string;
};

const FormLabel = ({ children, htmlFor }: FormLabelProps) => {
  return (
    <label className={styles.label} htmlFor={htmlFor}>
      {children}
    </label>
  );
};

export default FormLabel;
