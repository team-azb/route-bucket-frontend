import React from "react";
import { UserInfo } from "../../../types";

type BasicInfomationTableProps = {
  userInfo: UserInfo;
};

const BasicInfomationTable = ({ userInfo }: BasicInfomationTableProps) => {
  return <>{JSON.stringify(userInfo)}</>;
};

export default BasicInfomationTable;
