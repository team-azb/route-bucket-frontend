import React from "react";
import IconImage from "../IconImage";
import styles from "./style.module.css";

type IconImageUploadProps = {
  src?: string | null;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const IconImageUpload = ({ src, onChange }: IconImageUploadProps) => {
  return (
    <>
      <label htmlFor="fileUpload" className={styles.container}>
        <IconImage src={src} />
      </label>
      <input
        type="file"
        id="fileUpload"
        accept="image/*"
        className={styles.fileUpload}
        onChange={onChange}
      />
    </>
  );
};

export default IconImageUpload;
