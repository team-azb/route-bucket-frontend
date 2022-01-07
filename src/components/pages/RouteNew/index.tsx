import React from "react";
import SignInRequiredTemplate from "../../organisms/SignInRequiredTemplate";
import PageContainer from "../../atoms/PageContainer";
import PageTitle from "../../atoms/PageTitle";
import FormContainer from "../../atoms/form/FormContainer";
import SingleFormWrapper from "../../atoms/form/SingleFormWrapper";

const RouteNew = () => {
  return (
    <SignInRequiredTemplate>
      <PageContainer>
        <PageTitle title="ルート作成" />
        <SingleFormWrapper>
          <FormContainer>ルート作成フォーム</FormContainer>
        </SingleFormWrapper>
      </PageContainer>
    </SignInRequiredTemplate>
  );
};

export default RouteNew;
