import React from "react";
import { pagePaths } from "../../../../consts/uriComponents";
import styles from "./style.module.css";

type IconImageProps = {
  src?: string | null;
};

const IconImage = ({ src }: IconImageProps) => {
  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        src={src ? src : pagePaths.userIcon()}
        alt="userIcon"
      />
    </div>
  );
};

export default IconImage;
