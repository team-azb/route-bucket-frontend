import React from "react";
import BasicInformationTable from "../BasicInformationTable";
import IconImage from "../../atoms/IconImage";
import { UserInfo } from "../../../types";
import styles from "./style.module.css";

type BasicInformationProps = {
  userInfo: UserInfo;
};

const BasicInformation = ({ userInfo }: BasicInformationProps) => {
  return (
    <div className={styles.container}>
      <IconImage />
      <BasicInformationTable userInfo={userInfo} />
    </div>
  );
};

export default BasicInformation;