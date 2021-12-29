import React from "react";
import BasicInformationTable from "../BasicInformationTable";
import { UserInfo } from "../../../types";

type BasicInformationProps = {
  userInfo: UserInfo;
};

const BasicInformation = ({ userInfo }: BasicInformationProps) => {
  return (
    <div>
      <BasicInformationTable userInfo={userInfo} />
    </div>
  );
};

export default BasicInformation;
