import React from "react";
import styles from "./style.module.css";

type PageTitleProps = {
  title: string;
};

/** ページのタイトルを作成する */
const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <hr />
    </>
  );
};

export default PageTitle;
