import React from "react";
import BasicInformation from "../BasicInformation";
import { useUserInfo } from "../../../../contexts/UserInfoProvider";
import PageContainer from "../../../atoms/PageContainer";
import PageTitle from "../../../atoms/PageTitle";
import RouteCardList from "../../card/RouteCardList";

const ProfileContent = () => {
  const userInfo = useUserInfo();
  return (
    <PageContainer>
      <PageTitle title="基本情報" />
      <BasicInformation userInfo={userInfo} />
      <PageTitle title="公開ルート" />
      <RouteCardList userId={userInfo.id} />
    </PageContainer>
  );
};

export default ProfileContent;
