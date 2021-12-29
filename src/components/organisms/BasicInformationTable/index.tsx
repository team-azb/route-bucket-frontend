import React from "react";
import { UserInfo } from "../../../types";

type BasicInformationTableProps = {
  userInfo: UserInfo;
};

const BasicInformationTable = ({ userInfo }: BasicInformationTableProps) => {
  return <>{JSON.stringify(userInfo)}</>;
};

export default BasicInformationTable;
