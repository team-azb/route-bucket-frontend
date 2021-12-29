import React from "react";
import styles from "./style.module.css";

type BasicInformationFieldProps = {
  id: string;
  labelName: string;
  fieldValue?: string | null;
};

const BasicInformationField = ({
  id,
  labelName,
  fieldValue,
}: BasicInformationFieldProps) => {
  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={id}>
        {labelName}
      </label>
      <p className={styles.value} id={id}>
        {fieldValue ? fieldValue : "未設定"}
      </p>
    </div>
  );
};

export default BasicInformationField;
