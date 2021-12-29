import React from "react";
import BasicInformationTable from "../BasicInformationTable";
import IconImage from "../IconImage";
import { UserInfo } from "../../../../types";
import styles from "./style.module.css";

type BasicInformationProps = {
  userInfo: UserInfo;
};

const BasicInformation = ({ userInfo }: BasicInformationProps) => {
  return (
    <div className={styles.container}>
      <IconImage src={userInfo.icon_url} />
      <BasicInformationTable userInfo={userInfo} />
    </div>
  );
};

export default BasicInformation;
