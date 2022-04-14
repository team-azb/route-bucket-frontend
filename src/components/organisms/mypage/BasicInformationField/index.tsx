import React from "react";
import FormLabel from "../../../atoms/form/FormLabel";
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
      <FormLabel htmlFor={id}>{labelName}</FormLabel>
      <p className={styles.value} id={id}>
        {fieldValue || "未設定"}
      </p>
    </div>
  );
};

export default BasicInformationField;
