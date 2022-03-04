import React from "react";
import styles from "./style.module.css";

type PageContainerProps = {
  children?: React.ReactNode;
};

const PageContainer = ({ children }: PageContainerProps) => {
  return <div className={styles.container}>{children}</div>;
};

export default PageContainer;
