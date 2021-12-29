import React from "react";
import BasicInfomationTable from "../BasicInfomationTable";
import { UserInfo } from "../../../types";

type BasicInfomationProps = {
  userInfo: UserInfo;
};

const BasicInfomation = ({ userInfo }: BasicInfomationProps) => {
  return (
    <div>
      <BasicInfomationTable userInfo={userInfo} />
    </div>
  );
};

export default BasicInfomation;
