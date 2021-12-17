import React from "react";
import styles from "./style.module.css";

type InputWithErrorProps = {
  id?: string;
  name?: string;
  type?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  errorMessage?: string;
};

const InputWithError = ({
  id,
  name,
  type,
  onChange,
  errorMessage,
}: InputWithErrorProps) => {
  return (
    <>
      <input
        id={id}
        type={type}
        name={name}
        className={styles.input}
        onChange={onChange}
      />
      <label className={styles.errorLabel} htmlFor={id}>
        {errorMessage}
      </label>
    </>
  );
};

export default InputWithError;
