import React from "react";
import styles from "./style.module.css";

type FormFieldProps = {
  children?: React.ReactNode;
  className?: string;
  flexDirection?: "row" | "column";
};

const FormField = ({
  children,
  className,
  flexDirection = "column",
}: FormFieldProps) => {
  return (
    <div
      className={[styles.field, className].join(" ")}
      style={{ flexDirection: flexDirection }}
    >
      {children}
    </div>
  );
};

export default FormField;
