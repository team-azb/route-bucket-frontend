import React from "react";
import styles from "./style.module.css";

type DrawingModeRadioProps = {
  id?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  checked?: boolean;
  children?: React.ReactNode;
};

const DrawingModeRadio = ({
  id,
  value,
  onChange,
  checked,
  children,
}: DrawingModeRadioProps) => {
  return (
    <>
      <input
        className={styles.radio}
        type="radio"
        id={id}
        name="drawingMode"
        value={value}
        onChange={onChange}
        checked={checked}
      />
      <label className={styles.label} htmlFor={id}>
        {children}
      </label>
    </>
  );
};

export default DrawingModeRadio;
