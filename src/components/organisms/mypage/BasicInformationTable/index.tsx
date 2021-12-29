import React from "react";
import { UserInfo } from "../../../../types";
import BasicInformationField from "../BasicInformationField";
import { useSignedInUserInfoContext } from "../../../../contexts/signedInUserContext";
import styles from "./style.module.css";

type BasicInformationTableProps = {
  userInfo: UserInfo;
};

const BasicInformationTable = ({ userInfo }: BasicInformationTableProps) => {
  const { signedInUser } = useSignedInUserInfoContext();
  return (
    <div className={styles.container}>
      <BasicInformationField
        id="name"
        labelName="ニックネーム"
        fieldValue={userInfo.name}
      />
      <BasicInformationField
        id="email"
        labelName="メールアドレス"
        fieldValue={signedInUser?.email}
      />
      <BasicInformationField
        id="birthdate"
        labelName="生年月日"
        fieldValue={userInfo.birthdate?.toDateString()}
      />
    </div>
  );
};

export default BasicInformationTable;
