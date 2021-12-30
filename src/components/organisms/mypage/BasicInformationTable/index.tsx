import React from "react";
import { UserInfo } from "../../../../types";
import BasicInformationField from "../BasicInformationField";
import styles from "./style.module.css";

type BasicInformationTableProps = {
  userInfo: UserInfo;
  email?: string | null;
};

const BasicInformationTable = ({
  userInfo,
  email,
}: BasicInformationTableProps) => {
  return (
    <div className={styles.container}>
      <BasicInformationField
        id="name"
        labelName="ニックネーム"
        fieldValue={userInfo.name}
      />
      {email && (
        <BasicInformationField
          id="email"
          labelName="メールアドレス"
          fieldValue={email}
        />
      )}
      <BasicInformationField
        id="birthdate"
        labelName="生年月日"
        fieldValue={userInfo.birthdate}
      />
    </div>
  );
};

export default BasicInformationTable;
