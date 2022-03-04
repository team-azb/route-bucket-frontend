import React from "react";
import styles from "./style.module.css";

const NotFoundContent = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 Not Found</h1>
      <p className={styles.text}>
        お探しのページは存在しないか、移動、削除された可能性がございます。
      </p>
    </div>
  );
};

export default NotFoundContent;
