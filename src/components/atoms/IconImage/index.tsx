import React from "react";
import { pagePaths } from "../../../consts/uriComponents";
import styles from "./style.module.css";

type IconImageProps = {
  src?: string;
};

const IconImage = ({ src }: IconImageProps) => {
  return (
    <div className={styles.container}>
      <img src={src ? src : pagePaths.USER_ICON} alt="userIcon" />
    </div>
  );
};

export default IconImage;
