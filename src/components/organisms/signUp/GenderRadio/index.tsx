import React from "react";
import styles from "./style.module.css";

type GenderRadioProps = {
  children?: React.ReactNode;
  id?: string;
  checked?: boolean;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const GenderRadio = ({
  children,
  id,
  checked,
  value,
  onChange,
}: GenderRadioProps) => {
  return (
    <>
      <input
        className={styles.radio}
        id={id}
        type="radio"
        name="gender"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label className={styles.label} htmlFor={id}>
        {children}
      </label>
    </>
  );
};

export default GenderRadio;
