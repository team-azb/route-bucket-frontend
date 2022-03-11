import React from "react";
import BasicInformationTable from "../BasicInformationTable";
import IconImage from "../IconImage";
import { UserInfo } from "../../../../types";
import styles from "./style.module.css";

type BasicInformationProps = {
  userInfo: UserInfo;
  email?: string | null;
};

const BasicInformation = ({ userInfo, email }: BasicInformationProps) => {
  return (
    <div className={styles.container}>
      <IconImage src={userInfo.icon_url} />
      <BasicInformationTable userInfo={userInfo} email={email} />
    </div>
  );
};

export default BasicInformation;
