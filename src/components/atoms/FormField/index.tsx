import React from "react";
import styles from "./style.module.css";

type FormFieldProps = {
  children?: React.ReactNode;
  className?: string;
};

const FormField = ({ children, className }: FormFieldProps) => {
  return <div className={[styles.field, className].join(" ")}>{children}</div>;
};

export default FormField;
