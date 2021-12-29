import React from "react";
import { UserInfo } from "../../../types";
import BasicInformationField from "../BasicInformationField";
import { useSignedInUserInfoContext } from "../../../contexts/signedInUserContext";

type BasicInformationTableProps = {
  userInfo: UserInfo;
};

const BasicInformationTable = ({ userInfo }: BasicInformationTableProps) => {
  const { signedInUser } = useSignedInUserInfoContext();
  return (
    <>
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
    </>
  );
};

export default BasicInformationTable;
