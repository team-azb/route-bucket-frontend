import React from "react";
import { CircularProgress } from "@mui/material";
import styles from "./style.module.css";

type LoadingDisplayProps = {
  message?: string;
};

const LoadingDisplay = ({ message }: LoadingDisplayProps) => {
  return (
    <div className={styles.container}>
      <p className={styles.message}>{message}</p>
      <CircularProgress />
    </div>
  );
};

export default LoadingDisplay;
