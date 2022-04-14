import React from "react";
import styles from "./style.module.css";

type FormInputProps = {
  className?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  name?: string;
  id?: string;
};

/** フォームで用いるinputフィールド */
const FormInput = ({
  className,
  value,
  onChange,
  type = "text",
  name,
  id,
}: FormInputProps) => {
  return (
    <input
      className={[styles.formInput, className].join(" ")}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      id={id}
    />
  );
};

export default React.memo(FormInput);
