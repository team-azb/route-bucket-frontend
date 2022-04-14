import React from "react";
import FormLabel from "../../atoms/form/FormLabel";
import FormInput from "../../atoms/form/FormInput";
import styles from "./style.module.css";

type InputWithErrorProps = {
  id?: string;
  name?: string;
  type?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  errorMessage?: string;
};

const InputWithError = ({
  id,
  name,
  type,
  value,
  onChange,
  errorMessage,
}: InputWithErrorProps) => {
  return (
    <>
      <FormInput
        id={id}
        type={type}
        name={name}
        className={styles.input}
        value={value}
        onChange={onChange}
      />
      <FormLabel className={styles.errorLabel} htmlFor={id}>
        {errorMessage}
      </FormLabel>
    </>
  );
};

export default InputWithError;
